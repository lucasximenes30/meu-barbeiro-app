'use server';

import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) throw new Error('Não autorizado');
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only');
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function deleteCloudinaryImage(publicId: string) {
  try {
    await verifyAuth(); // Garante que a exclusão seja feita por um admin/barbeiro autenticado
    
    if (!publicId) return { success: false, error: 'publicId não fornecido' };

    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Erro ao excluir imagem no Cloudinary:', error);
    return { success: false, error: 'Falha ao excluir imagem' };
  }
}
