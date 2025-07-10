import {Color, Size} from "@/api/Type";

type ProductImage = {
  url: string;
  isMain: boolean;
};

export type ExtractedImages = {
  mainImageUrl: string;
  subImageUrls: string[];
};

export function extractImagesFromProduct(images: ProductImage[]): ExtractedImages {
  const mainImage = images.find((img) => img.isMain);
  const subImages = images.filter((img) => !img.isMain);

  return {
    mainImageUrl: mainImage?.url || "",
    subImageUrls: subImages.map((img) => img.url),
  };
}

export const extractAttributesFromProductItems = async (productItems: any[]) => {
  const colorMap = new Map<string, { color: Color; image: File | null }>();
  const sizeMap = new Map<string, Size>();

  for (const item of productItems) {
    const { color, size, imageUrl } = item;

    // Size: gom unique
    if (!sizeMap.has(size.id)) {
      sizeMap.set(size.id, size);
    }

    // Color: gom unique + lấy ảnh nếu có
    if (!colorMap.has(color.id)) {
      let image: File | null = null;
      if (imageUrl) {
        image = await urlToFile(imageUrl, `color-${color.id}.jpg`);
      }
      colorMap.set(color.id, { color, image });
    }
  }

  return {
    selectedColors: Array.from(colorMap.values()),
    selectedSizes: Array.from(sizeMap.values()),
  };
};

export async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const contentType = blob.type || "image/jpeg";
  return new File([blob], filename, { type: contentType });
}