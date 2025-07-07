import React from "react";
import Input from "@/components/form/input/InputField";

interface VariantRow {
  color: string;
  colorName: string;
  size: string;
  sizeName: string;
}

interface ProductVariantTableProps {
  variantCombinations: VariantRow[];
  variantData: { [key: string]: { price: string; quantity: string } };
  handleVariantChange: (key: string, field: "price" | "quantity", value: string) => void;
  getVariantError: (colorId: string, sizeId: string) => string[];
}

const ProductVariantTable: React.FC<ProductVariantTableProps> = ({
  variantCombinations,
  variantData,
  handleVariantChange,
  getVariantError,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-[500px] w-full border text-sm">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-800">
          <th className="border px-2 py-1">Màu sắc</th>
          <th className="border px-2 py-1">Size</th>
          <th className="border px-2 py-1">Giá</th>
          <th className="border px-2 py-1">Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {variantCombinations.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-400">Chọn màu và size để tạo biến thể</td>
          </tr>
        ) : (
          variantCombinations.map(({ color, colorName, size, sizeName }) => {
            const key = `${color}_${size}`;
            const errors = getVariantError(color, size);
            return (
              <tr key={key}>
                <td className="border px-2 py-1">{colorName}</td>
                <td className="border px-2 py-1">{sizeName}</td>
                <td className="border px-2 py-1">
                  <Input
                    type="number"
                    min="0"
                    value={variantData[key]?.price || ""}
                    onChange={e => handleVariantChange(key, "price", e.target.value)}
                    className="w-24"
                    placeholder="Giá"
                    error={!!errors.find(e => e.includes('giá'))}
                    hint={errors.find(e => e.includes('giá'))}
                  />
                </td>
                <td className="border px-2 py-1">
                  <Input
                    type="number"
                    min="0"
                    value={variantData[key]?.quantity || ""}
                    onChange={e => handleVariantChange(key, "quantity", e.target.value)}
                    className="w-20"
                    placeholder="Số lượng"
                    error={!!errors.find(e => e.includes('số lượng'))}
                    hint={errors.find(e => e.includes('số lượng'))}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

export default ProductVariantTable; 