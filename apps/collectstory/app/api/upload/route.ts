import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const UPLOAD_CONFIG = {
  item: { maxBytes: 5 * 1024 * 1024, maxDimension: 1200, quality: 80 },
  avatar: { maxBytes: 3 * 1024 * 1024, maxDimension: 400, quality: 80 },
} as const;

type UploadType = keyof typeof UPLOAD_CONFIG;

async function optimizeImage(input: Buffer, type: UploadType): Promise<Buffer> {
  const { maxDimension, quality } = UPLOAD_CONFIG[type];
  const optimized = await sharp(input)
    .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  if (optimized.byteLength > input.byteLength) {
    throw new Error('Optimized image is larger than the original');
  }
  return optimized;
}

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
