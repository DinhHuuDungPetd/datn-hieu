import { Color } from "@/api/Type";

export interface ProductVariant {
  colorId: string;
  sizeId: string; 
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ValidateProductFormInput {
  productName: string;
  description: string;
  previews: (string|null)[];
  colorFields: Array<{ value: string; name: string; checked: boolean; preview: string|null }>;
  selectedSizes: string[];
  variantData: { [key: string]: { price: string; quantity: string } };
}

export function validateProductForm({
  productName,
  description,
  previews,
  colorFields,
  selectedSizes,
  variantData,
}: ValidateProductFormInput) {
  const errors: string[] = [];
  // Validate tên, mô tả
  if (!productName.trim()) errors.push("Tên sản phẩm không được để trống");
  if (!description.trim()) errors.push("Mô tả sản phẩm không được để trống");
  // Validate images
  const imageList = previews
    .map((url, idx) => url ? { url, isMain: idx === 0 } : null)
    .filter(Boolean) as { url: string; isMain: boolean }[];
  if (imageList.length === 0) errors.push("Cần ít nhất 1 ảnh sản phẩm");
  if (imageList.length === 1 && !imageList[0].isMain) errors.push("Nếu chỉ có 1 ảnh thì phải là ảnh chính (ô đầu tiên)");
  // Không cho phép 2 ảnh trùng nhau
  const urlSet = new Set<string>();
  for (const img of imageList) {
    if (urlSet.has(img.url)) {
      errors.push("Không được chọn 2 ảnh sản phẩm trùng nhau");
      break;
    }
    urlSet.add(img.url);
  }
  // Validate biến thể
  const selectedColors = colorFields.filter(c => c.checked);
  if (selectedColors.length === 0) errors.push("Chọn ít nhất 1 màu");
  if (selectedSizes.length === 0) errors.push("Chọn ít nhất 1 size");
  // Nếu có ít nhất 1 màu được chọn có ảnh thì tất cả màu được chọn đều phải có ảnh
  const hasAnyColorImage = selectedColors.some(c => !!c.preview);
  if (hasAnyColorImage) {
    selectedColors.forEach(c => {
      if (!c.preview) errors.push(`Màu ${c.name} cần có ảnh vì đã có màu khác có ảnh`);
    });
  }
  // Tạo productItems
  const productItems = selectedColors.flatMap(color =>
    selectedSizes.map(sizeId => {
      const key = `${color.value}_${sizeId}`;
      const data = variantData[key] || {};
      return {
        colorId: color.value,
        sizeId: sizeId,
        price: data.price ? Number(data.price) : 0,
        quantity: data.quantity ? Number(data.quantity) : 0,
        imageUrl: color.preview || "",
      };
    })
  );
  if (productItems.length === 0) errors.push("Phải có ít nhất 1 biến thể sản phẩm");
  productItems.forEach(item => {
    if (!item.colorId) errors.push("Thiếu mã màu cho biến thể");
    if (!item.sizeId) errors.push("Thiếu mã size cho biến thể");
    if (!item.price || item.price <= 0) errors.push(`Biến thể màu ${item.colorId} size ${item.sizeId} chưa nhập giá hoặc giá <= 0`);
    if (item.quantity === undefined || item.quantity < 0) errors.push(`Biến thể màu ${item.colorId} size ${item.sizeId} chưa nhập số lượng hoặc số lượng < 0`);
  });
  const result = errors.length === 0 ? {
    productName,
    description,
    images: imageList,
    productItems,
  } : null;
  return { errors, result };
} 