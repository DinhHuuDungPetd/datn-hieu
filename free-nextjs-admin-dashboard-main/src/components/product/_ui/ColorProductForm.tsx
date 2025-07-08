import {Color} from "@/api/Type";
import ImageDropZone from "@/components/product/_ui/ImageDropZone";

type Props = {
  color: Color;
  image: File | null;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onImageChange: (file: File | null) => void;
};

export default function ColorProductForm({
                                           color,
                                           image,
                                           checked,
                                           onCheckChange,
                                           onImageChange,
                                         }: Props) {
  return (
      <div
          className={`flex items-center justify-between gap-4 px-4 py-3 rounded-md border shadow-sm ${
              checked ? "bg-white" : "bg-gray-100 opacity-60"
          }`}
      >
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              const isChecked = e.target.checked;
              onCheckChange(isChecked);
              if (!isChecked) onImageChange(null); // clear ảnh nếu bỏ chọn
            }}
            className="accent-blue-600 w-5 h-5"
        />
        <ImageDropZone
            value={image}
            onChange={(file) => checked && onImageChange(file)}
            size={84}
        />
        <div className="flex-1 text-sm font-medium text-gray-800">{color.name}</div>
      </div>
  );
}
