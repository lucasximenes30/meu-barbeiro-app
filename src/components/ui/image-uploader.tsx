'use client';

import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon, Trash2, Loader2, Check } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onRemove?: () => void;
  defaultImage?: string;
  folder?: string;
  aspectRatio?: number;
}

export function ImageUploader({ onUploadSuccess, onRemove, defaultImage, folder = 'meu-barbeiro/uploads', aspectRatio = 1 }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(defaultImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Crop states
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    setImageUrl(defaultImage || '');
  }, [defaultImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show crop modal
    const localUrl = URL.createObjectURL(file);
    setCropImageSrc(localUrl);
    
    // Clear input so we can upload same file again if canceled
    if (inputRef.current) inputRef.current.value = '';
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      
      if (!croppedBlob) {
        throw new Error('Falha ao recortar imagem');
      }

      // Close crop modal
      setCropImageSrc(null);

      // 1. Obter assinatura e timestamp
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
      });
      
      if (!signRes.ok) throw new Error('Falha ao obter assinatura');
      const { signature, timestamp } = await signRes.json();

      // 2. Montar FormData
      const formData = new FormData();
      formData.append('file', croppedBlob);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      // 3. Fazer upload direto
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error('Cloud name não configurado no .env');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('Falha no upload para o Cloudinary');
      
      const result = await uploadRes.json();
      
      if (result.secure_url && result.public_id) {
        setImageUrl(result.secure_url);
        onUploadSuccess(result.secure_url, result.public_id);
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Erro ao enviar imagem. Verifique o console.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef}
        onChange={handleFileChange}
      />
      {imageUrl ? (
        <div className="relative group overflow-hidden rounded-xl border border-white/10 w-full h-48 bg-secondary/20">
          <img src={imageUrl} alt="Upload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
              {isUploading ? 'Enviando...' : 'Trocar'}
            </Button>

            {onRemove && (
              <Button type="button" variant="destructive" size="sm" onClick={() => {
                setImageUrl('');
                onRemove();
              }} disabled={isUploading}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 w-full h-48 border-2 border-dashed border-white/10 rounded-xl bg-secondary/10 transition-colors ${isUploading ? 'cursor-not-allowed opacity-70' : 'hover:bg-secondary/20 cursor-pointer text-muted-foreground hover:text-white'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Enviando imagem...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 opacity-50" />
              <span className="text-sm font-medium">Clique para selecionar foto</span>
            </>
          )}
        </div>
      )}

      {/* Modal de Recorte */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => !open && setCropImageSrc(null)}>
        <DialogContent className="max-w-md w-[95vw] rounded-3xl glass-card border-white/10 p-0 overflow-hidden flex flex-col bg-background/95">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-xl">Ajustar Imagem</DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-[60vh] min-h-[300px] bg-black">
            {cropImageSrc && (
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{ containerClassName: 'h-full w-full' }}
              />
            )}
          </div>

          <div className="p-4 pt-3 flex justify-end gap-3 bg-background/50 backdrop-blur-md">
            <Button type="button" variant="ghost" onClick={() => setCropImageSrc(null)} className="rounded-xl flex-1">
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirmCrop} disabled={isUploading} className="rounded-xl flex-1 bg-primary text-primary-foreground font-bold">
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              {isUploading ? 'Salvando...' : 'Confirmar e Enviar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
