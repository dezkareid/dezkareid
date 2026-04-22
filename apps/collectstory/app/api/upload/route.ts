import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { optimizeImage, UPLOAD_CONFIG, type UploadType } from '@/lib/image/optimize';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const uploadType: UploadType = formData.get('type') === 'avatar' ? 'avatar' : 'item';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
      { status: 400 },
    );
  }

  const { maxBytes } = UPLOAD_CONFIG[uploadType];
  if (file.size > maxBytes) {
    const limitMb = maxBytes / (1024 * 1024);
    return NextResponse.json(
      { error: `File too large. Maximum size is ${limitMb} MB.` },
      { status: 400 },
    );
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let optimizedBuffer: Buffer;
  try {
    optimizedBuffer = await optimizeImage(rawBuffer, uploadType);
  }
  catch (error) {
    console.error('[/api/upload] Image optimization error:', error);
    return NextResponse.json({ error: 'Image processing failed. Please try again.' }, { status: 500 });
  }

  const folder
    = uploadType === 'avatar'
      ? `collectstory/avatars/${user.id}`
      : `collectstory/${user.id}`;

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: 'image' },
          (error, uploadResult) => {
            if (error || !uploadResult) return reject(error ?? new Error('Upload failed'));
            resolve({ secure_url: uploadResult.secure_url });
          },
        )
        .end(optimizedBuffer);
    });

    return NextResponse.json({ url: result.secure_url });
  }
  catch (error) {
    console.error('[/api/upload] Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
