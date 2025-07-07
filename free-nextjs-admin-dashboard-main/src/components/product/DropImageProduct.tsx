import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import React, { useState } from "react";

interface DropImageProductProps {
  preview: string | null;
  onDrop: (files: File[]) => void;
  onRemove: () => void;
  index: number;
  ratioError?: string;
  setRatioError?: (msg: string | null) => void;
}

function validateImageRatio(file: File, minRatio = 0.9, maxRatio = 1.1): Promise<true | string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = function () {
      resolve(true);
    };
    img.onerror = function () {
      resolve("Không đọc được ảnh.");
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function DropImageProduct({ preview, onDrop, onRemove, ratioError, setRatioError }: DropImageProductProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDrop = async (files: File[]) => {
    if (files && files[0]) {
      const result = await validateImageRatio(files[0]);
      if (result === true) {
        setLocalError(null);
        setRatioError && setRatioError(null);
        onDrop(files);
      } else {
        setLocalError(result as string);
        setRatioError && setRatioError(result as string);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-start border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 bg-gray-50 dark:bg-gray-900 hover:border-brand-500 focus:border-brand-500 w-32 h-32 aspect-square mx-auto ${
          isDragActive ? "border-brand-500 bg-gray-100 dark:bg-gray-800" : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Preview`}
              className="object-cover w-full h-full rounded-xl"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-xs hover:bg-red-500 hover:text-white transition"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
            >
              &times;
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <ImagePlus size={32} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-400 text-center">Kéo hoặc chọn ảnh</span>
          </div>
        )}
      </div>
      {(localError || ratioError) && (
        <div className="text-xs text-red-500 mt-1 text-center">{localError || ratioError}</div>
      )}
    </div>
  );
}