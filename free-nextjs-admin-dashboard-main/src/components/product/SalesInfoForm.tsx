import { useState } from "react";
import { Variant } from "@/components/product/CreateProductForm";

type Props = {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
};

export default function SalesInfoForm({ variants, onChange }: Props) {
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleChange = (index: number, field: "price" | "quantity", value: string) => {
    const updated: Variant[] = [...variants];
    updated[index][field] = value === "" ? null : Number(value);
    onChange(updated);
  };

  const applyToVariants = () => {
    const updated = variants.map((variant) => {
      const matchColor =
          selectedColorId === "" || variant.color.id === selectedColorId;
      const matchSize =
          selectedSizeId === "" || variant.size.id === selectedSizeId;

      if (!matchColor || !matchSize) return variant;

      return {
        ...variant,
        price: price !== "" ? Number(price) : variant.price,
        quantity: quantity !== "" ? Number(quantity) : variant.quantity,
      };
    });

    onChange(updated);
  };

  const colors = Array.from(
      new Map(variants.map((v) => [v.color.id, v.color])).values()
  );
  const sizes = Array.from(
      new Map(variants.map((v) => [v.size.id, v.size])).values()
  );

  return (
      <div className="mb-20">
        {/* FORM NHẬP NHANH */}
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Màu</label>
            <select
                value={selectedColorId}
                onChange={(e) => setSelectedColorId(e.target.value)}
                className="border px-2 py-1 rounded w-[150px]"
            >
              <option value="">-- Tất cả --</option>
              {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Size</label>
            <select
                value={selectedSizeId}
                onChange={(e) => setSelectedSizeId(e.target.value)}
                className="border px-2 py-1 rounded w-[150px]"
            >
              <option value="">-- Tất cả --</option>
              {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Giá (₫)</label>
            <input
                type="number"
                className="border px-2 py-1 rounded w-[120px]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Số lượng</label>
            <input
                type="number"
                className="border px-2 py-1 rounded w-[120px]"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <button
              type="button"
              onClick={applyToVariants}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Áp dụng
          </button>
        </div>

        {/* BẢNG CHỈNH SỬA BIẾN THỂ */}
        <table className="w-full table-auto border text-sm">
          <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Màu</th>
            <th className="p-2 border">Size</th>
            <th className="p-2 border">Giá (₫)</th>
            <th className="p-2 border">Tồn kho</th>
          </tr>
          </thead>
          <tbody>
          {variants.map((variant, index) => (
              <tr key={`${variant.color.id}-${variant.size.id}`}>
                <td className="p-2 border">{variant.color.name}</td>
                <td className="p-2 border">{variant.size.name}</td>
                <td className="p-2 border">
                  <input
                      type="number"
                      className="border rounded w-full px-2 py-1"
                      value={variant.price ?? ""}
                      onChange={(e) => handleChange(index, "price", e.target.value)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                      type="number"
                      className="border rounded w-full px-2 py-1"
                      value={variant.quantity ?? ""}
                      onChange={(e) =>
                          handleChange(index, "quantity", e.target.value)
                      }
                  />
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
