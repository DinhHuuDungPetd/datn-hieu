import React from "react";
import DropImageProduct from "./DropImageProduct";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";

interface ColorField {
  value: string;
  name: string;
  checked: boolean;
  image: File | null;
  preview: string | null;
}

interface ColorSelectorProps {
  colorFields: ColorField[];
  setColorFields: React.Dispatch<React.SetStateAction<ColorField[]>>;
  getFieldError: (field: string) => string | undefined;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colorFields, setColorFields, getFieldError }) => (
  <div className="mb-6">
    <Label>Màu sản phẩm</Label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {colorFields.map((color, idx) => (
        <div key={color.value} className="flex items-center gap-4 justify-start border p-2 rounded-lg">
          <div className="w-[132px]">
            <DropImageProduct
              preview={color.preview}
              onDrop={(files) => {
                const file = files[0];
                const url = file ? URL.createObjectURL(file) : null;
                setColorFields(fields => fields.map((c, i) => {
                  if (i === idx) {
                    if (c.preview) URL.revokeObjectURL(c.preview);
                    return { ...c, image: file, preview: url };
                  }
                  return c;
                }));
              }}
              onRemove={() => {
                setColorFields(fields => fields.map((c, i) => {
                  if (i === idx) {
                    if (c.preview) URL.revokeObjectURL(c.preview);
                    return { ...c, image: null, preview: null };
                  }
                  return c;
                }));
              }}
              index={idx}
            />
            {/* Lỗi thiếu ảnh cho màu */}
            {color.checked && getFieldError(`Màu ${color.name} cần có ảnh`) && (
              <div className="text-xs text-red-500 mt-1">{getFieldError(`Màu ${color.name} cần có ảnh`)}</div>
            )}
          </div>
          <Input
            value={color.name}
            onChange={e => {
              const name = e.target.value;
              setColorFields(fields => fields.map((c, i) => i === idx ? { ...c, name } : c));
            }}
            className="w-32"
          />
          <Checkbox
            checked={color.checked}
            onChange={checked => {
              setColorFields(fields => fields.map((c, i) => i === idx ? { ...c, checked } : c));
            }}
          />
          <span className="text-xs text-gray-500 ml-2">Chọn</span>
        </div>
      ))}
    </div>
  </div>
);

export default ColorSelector; 