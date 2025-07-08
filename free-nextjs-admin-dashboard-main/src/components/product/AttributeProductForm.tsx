"use client";

import React, {useEffect, useRef, useState} from "react";
import ColorProductForm from "@/components/product/_ui/ColorProductForm";
import {Attribute, Color, Size} from "@/api/Type";
import {getAttributeProduct} from "@/api/attributeApi";
import {toast} from "react-toastify";
type Props = {
  initialData?: {
    selectedSizes: Size[];
    selectedColors: { color: Color; image: File | null }[];
  };
  onChange: (data: {
    selectedSizes: Size[];
    selectedColors: { color: Color; image: File | null }[];
  }) => void;
};

export default function AttributeProductForm({ onChange, initialData }: Props) {
  const [selectedColors, setSelectedColors] = useState<{ color: Color; image: File | null }[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [attribute, setAttribute] = useState<Attribute>({colors: [], sizes: []});

  useEffect(() => {
    (async ()=>{
     try {
       const response = await getAttributeProduct();
       setAttribute(response);
     }catch (e){
       console.error(e);
       toast.error("có lỗi xảy ra!");
     }
    })()

  }, []);

  useEffect(() => {
    if(initialData){
     setSelectedColors(initialData.selectedColors);
     setSelectedSizes(initialData.selectedSizes);
    }
  }, [initialData]);

  const toggleSize = (size: Size) => {
    setSelectedSizes((prev) =>
        prev.some((s) => s.id === size.id)
            ? prev.filter((s) => s.id !== size.id)
            : [...prev, size]
    );
  };

  const toggleColor = (color: Color, checked: boolean) => {
    setSelectedColors((prev) => {
      const exists = prev.find((c) => c.color.id === color.id);
      if (checked && !exists) {
        return [...prev, { color, image: null }];
      }
      if (!checked && exists) {
        return prev.filter((c) => c.color.id !== color.id);
      }
      return prev;
    });
  };
  const updateColorImage = (colorId: string, file: File | null) => {
    setSelectedColors((prev) =>
        prev.map((c) =>
            c.color.id === colorId ? { ...c, image: file } : c
        )
    );
  };

  useEffect(() => {
    onChange({
      selectedSizes,
      selectedColors,
    });
  }, [selectedSizes, selectedColors]);

  return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attribute?.colors?.map((color) => {
            const existing = selectedColors.find((c) => c.color.id === color.id);
            const checked = !!existing;
            return (
                <ColorProductForm
                    key={color.id}
                    color={color}
                    checked={checked}
                    image={existing?.image || null}
                    onCheckChange={(checked) => toggleColor(color, checked)}
                    onImageChange={(file) => updateColorImage(color.id, file)}
                />
            );
          })}
        </div>
        {/* SIZE */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Chọn size</h3>
          <div className="flex flex-wrap gap-2">
            {attribute?.sizes?.map((size) => {
              const selected = selectedSizes.some((s) => s.id === size.id);
              return (
                  <button
                      key={size.id}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                          selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {size.name}
                  </button>
              );
            })}
          </div>
        </div>
      </div>
  );
}
