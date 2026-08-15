import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getAuthBarbershopId } from '@/lib/auth-server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticação: apenas usuários autenticados podem gerar assinatura
    await getAuthBarbershopId(req);
    
    // 2. Extrair parâmetros enviados pelo CldUploadWidget no frontend
    const body = await req.json();
    const folder = body.folder || 'meu-barbeiro/uploads';
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature, timestamp, folder });
  } catch (error) {
    console.error('Erro ao gerar assinatura Cloudinary:', error);
    return NextResponse.json({ error: 'Não autorizado ou erro interno' }, { status: 401 });
  }
}
