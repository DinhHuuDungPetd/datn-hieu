"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

type Props = {
  value: File | null;
  previewUrl?: string;
  onChange: (file: File | null) => void;
  size?: number;
};

const ImageDropZone: React.FC<Props> = ({ value, previewUrl, onChange, size = 120 }) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const preview = value ? URL.createObjectURL(value) : previewUrl || null;

  return (
      <div
          style={{ width: size, height: size }}
          className="relative border-2 border-dashed rounded-lg overflow-hidden group bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          {...getRootProps()}
      >
        <input {...getInputProps()} />
        {preview ? (
            <>
              <img src={preview} alt="preview" className="object-cover w-full h-full" />
              <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                  className="absolute top-1 right-1 bg-white text-gray-700 p-1 rounded-full shadow hover:bg-red-100 hover:text-red-600 transition"
              >
                <X size={16} />
              </button>
            </>
        ) : (
            <div className="text-center text-sm text-gray-400 px-2">
              {isDragActive ? "Thả ảnh vào..." : "Thêm ảnh"}
            </div>
        )}
      </div>
  );
};

export default ImageDropZone;