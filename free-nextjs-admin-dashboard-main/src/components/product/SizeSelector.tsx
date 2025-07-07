import React from "react";
import Label from "@/components/form/Label";

interface SizeOption {
  id: string;
  name: string;
}

interface SizeSelectorProps {
  sizeOptions: SizeOption[];
  selectedSizes: string[];
  setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizeOptions, selectedSizes, setSelectedSizes }) => (
  <div className="mb-6">
    <Label>Chọn size sản phẩm</Label>
    <div className="flex flex-wrap gap-2 mt-2">
      {sizeOptions.map(option => (
        <button
          key={option.id}
          type="button"
          className={`px-4 py-2 rounded-full border text-sm font-medium transition
            ${selectedSizes.includes(option.id)
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
          `}
          onClick={() => {
            setSelectedSizes(sizes =>
              sizes.includes(option.id)
                ? sizes.filter(s => s !== option.id)
                : [...sizes, option.id]
            );
          }}
        >
          {option.name}
        </button>
      ))}
    </div>
    <div className="mt-2 text-sm text-gray-500">Đã chọn: {sizeOptions.filter(s=>selectedSizes.includes(s.id)).map(s=>s.name).join(", ") || "(Chưa chọn)"}</div>
  </div>
);

export default SizeSelector; 