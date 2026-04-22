import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { optimizeImage, UPLOAD_CONFIG } from '@/lib/image/optimize';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_PHOTOS = 20;

type RouteContext = { params: Promise<{ sessionId: string }> };

async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: 'image' },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error ?? new Error('Upload failed'));
          resolve({ secure_url: uploadResult.secure_url });
        },
      )
      .end(buffer);
  });
  return result.secure_url;
}

async function getPhotoCount(supabase: Awaited<ReturnType<typeof createClient>>, sessionId: string): Promise<number> {
  const { count } = await supabase
    .from('session_photos')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId);
  return count ?? 0;
}

async function getNextPosition(supabase: Awaited<ReturnType<typeof createClient>>, sessionId: string): Promise<number> {
  const { data: maxRow } = await supabase
    .from('session_photos')
    .select('position')
    .eq('session_id', sessionId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (maxRow?.position ?? -1) + 1;
}

async function validateFile(file: File): Promise<NextResponse | null> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
      { status: 400 },
    );
  }
  const { maxBytes } = UPLOAD_CONFIG.session;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${maxBytes / (1024 * 1024)} MB.` },
      { status: 400 },
    );
  }
  return null;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { sessionId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: session } = await supabase
    .from('photo_sessions')
    .select('id, user_id, slug')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();
  if (!session) return NextResponse.json({ error: 'Session not found or access denied' }, { status: 403 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();
  const username = profile?.username as string | undefined;

  const photoCount = await getPhotoCount(supabase, sessionId);
  if (photoCount >= MAX_PHOTOS) {
    return NextResponse.json({ error: `A session can hold at most ${MAX_PHOTOS} photos.` }, { status: 422 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileError = await validateFile(file);
  if (fileError) return fileError;

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let optimizedBuffer: Buffer;
  try {
    optimizedBuffer = await optimizeImage(rawBuffer, 'session');
  }
  catch (error) {
    console.error('[/api/sessions/photos] Optimization error:', error);
    return NextResponse.json({ error: 'Image processing failed. Please try again.' }, { status: 500 });
  }

  const nextPosition = await getNextPosition(supabase, sessionId);

  let uploadedUrl: string;
  try {
    uploadedUrl = await uploadToCloudinary(optimizedBuffer, `collectstory/${user.id}/sessions/${sessionId}`);
  }
  catch (error) {
    console.error('[/api/sessions/photos] Cloudinary error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }

  const { data: photo, error: insertError } = await supabase
    .from('session_photos')
    .insert({ session_id: sessionId, user_id: user.id, image_url: uploadedUrl, position: nextPosition })
    .select('id, image_url, position')
    .single();

  if (insertError || !photo) {
    return NextResponse.json({ error: 'Failed to save photo record.' }, { status: 500 });
  }

  revalidateTag(`session-photos:${sessionId}`, 'max');
  if (username) {
    revalidateTag(`session:${username}:${session.slug}`, 'max');
    revalidateTag(`sessions:${username}`, 'max');
  }

  return NextResponse.json({ id: photo.id, image_url: photo.image_url, position: photo.position }, { status: 201 });
}
