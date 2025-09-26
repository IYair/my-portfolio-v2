"use client";

import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
  width?: number;
  height?: number;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className = "",
  placeholder = "Haz clic para subir una imagen o arrastra aquí",
  accept = "image/*",
  maxSize = 5, // 5MB by default
  width = 200,
  height = 200,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = useCallback(
    async (file: File) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`La imagen debe ser menor a ${maxSize}MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const data = await response.json();
        onChange(data.url);
        toast.success("Imagen subida correctamente");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error al subir la imagen");
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        uploadImage(file);
      } else {
        toast.error("Por favor selecciona un archivo de imagen válido");
      }
    },
    [disabled, isUploading, uploadImage]
  );

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  }, [onChange, onRemove]);

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative inline-block">
          <div
            className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ width, height }}
          >
            <Image
              src={value}
              alt="Imagen seleccionada"
              fill
              className="object-cover"
              sizes={`${width}px`}
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600"
          } ${
            disabled || isUploading
              ? "cursor-not-allowed opacity-50"
              : "hover:border-gray-400 dark:hover:border-gray-500"
          } `}
          style={{ width, height }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Subiendo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-center">
              <CloudArrowUpIcon className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{placeholder}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PNG, JPG, GIF hasta {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
