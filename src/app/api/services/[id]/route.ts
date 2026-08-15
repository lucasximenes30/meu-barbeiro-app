import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ServiceService } from '@/modules/services/service.service';
import { ServiceRepository } from '@/modules/services/service.repository';
import { getAuthBarbershopId } from '@/lib/auth-server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const service = new ServiceService(new ServiceRepository());

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
    const item = await service.findById((await params).id, barbershopId);
    return successResponse(item, 'Item retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const barbershopId = await getAuthBarbershopId(req);
    const existing = await service.findById((await params).id, barbershopId);
    
    if (existing && existing.imagePublicId && body.imagePublicId && existing.imagePublicId !== body.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (err) {
        console.error('Failed to delete old service image from Cloudinary', err);
      }
    }

    const updated = await service.update((await params).id, body);
    return successResponse(updated, 'Updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const barbershopId = await getAuthBarbershopId(req);
    const existing = await service.findById((await params).id, barbershopId);
    
    if (existing && existing.imagePublicId && body.imagePublicId && existing.imagePublicId !== body.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (err) {
        console.error('Failed to delete old service image from Cloudinary', err);
      }
    }

    const patched = await service.update((await params).id, body);
    return successResponse(patched, 'Patched successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
    const existing = await service.findById((await params).id, barbershopId);

    if (existing && existing.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (err) {
        console.error('Failed to delete service image from Cloudinary', err);
      }
    }

    await service.delete((await params).id);
    return successResponse(null, 'Deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
