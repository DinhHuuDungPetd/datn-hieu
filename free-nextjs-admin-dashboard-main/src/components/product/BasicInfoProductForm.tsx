"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageDropZone from "@/components/product/_ui/ImageDropZone";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { toast } from "react-toastify";
import {urlToFile} from "@/heppler/extractImagesFromProduct";

type Props = {
  initialData?: {
    productName: string;
    description: string;
    mainImageUrl: string; // URL từ server
    subImageUrls: string[]; // URL từ server
  };
  onChange: (data: {
    productName: string;
    description: string;
    mainImage: File | null;
    subImages: (File | null)[];
  }) => void;
};

const BasicInfoProductForm = React.memo(function BasicInfoProductForm({ onChange, initialData }: Props) {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<(File | null)[]>(Array(8).fill(null));
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    images: false,
  });
  const didInit = useRef(false);

  useEffect(() => {
    if (!initialData || didInit.current) return;
    didInit.current = true;
    setProductName(initialData.productName || "");
    setDescription(initialData.description || "");
    (async () => {
      if (initialData.mainImageUrl) {
        const main = await urlToFile(initialData.mainImageUrl, "main.jpg");
        setMainImage(main);
      }
      if (Array.isArray(initialData.subImageUrls)) {
        const subImageFiles = await Promise.all(
          initialData.subImageUrls.map((url, idx) => urlToFile(url, `sub-${idx}.jpg`))
        );
        const filledSubImages = Array(8).fill(null);
        subImageFiles.forEach((file, idx) => {
          filledSubImages[idx] = file;
        });
        setSubImages(filledSubImages);
      }
    })();
  }, [initialData]);

  const validate = () => {
    const hasAtLeastOneImage = !!mainImage || subImages.some((img) => img !== null);
    const onlyOneImage = (mainImage ? 1 : 0) + subImages.filter((i) => i !== null).length === 1;

    const newErrors = {
      name: productName.trim() === "",
      description: description.trim() === "",
      images: !hasAtLeastOneImage || (onlyOneImage && !mainImage),
    };

    setErrors(newErrors);

    if (newErrors.name) toast.error("Tên sản phẩm không được để trống");
    if (newErrors.description) toast.error("Mô tả không được để trống");
    if (newErrors.images) {
      toast.error(
          !hasAtLeastOneImage
              ? "Phải có ít nhất 1 ảnh"
              : "Nếu chỉ có 1 ảnh, thì phải là ảnh chính"
      );
    }

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubImageChange = (index: number, file: File | null) => {
    if (!file) {
      const updated = [...subImages];
      updated[index] = null;
      setSubImages(updated);
      return;
    }

    const isSameAsMain =
        mainImage &&
        mainImage.name === file.name &&
        mainImage.size === file.size &&
        mainImage.lastModified === file.lastModified;

    if (isSameAsMain) {
      toast.error("Ảnh này đã được chọn làm ảnh chính!");
      return;
    }

    const isDuplicateSub = subImages.some((existing, i) => {
      if (i === index || !existing) return false;
      return (
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      );
    });

    if (isDuplicateSub) {
      toast.error("Ảnh này đã được chọn ở một vị trí khác!");
      return;
    }

    // Kiểm tra không cho tải ảnh sau nếu ảnh trước chưa có
    if (index > 0 && !subImages[index - 1]) {
      toast.warning("Vui lòng tải ảnh ở vị trí trước trước khi tiếp tục.");
      return;
    }

    const updated = [...subImages];
    updated[index] = file;
    setSubImages(updated);
  };


  useEffect(() => {
    onChange({ productName, description, mainImage, subImages });
    // eslint-disable-next-line
  }, [productName, description, mainImage, subImages]);

  const handleSubmit = () => {
    if (!validate()) return;
    const validSub = subImages.filter((f) => f !== null) as File[];
    console.log("Main image:", mainImage);
    console.log("Sub images:", validSub);
    console.log("Product name:", productName);
    console.log("Description:", description);
    toast.success("Thông tin hợp lệ. Sẵn sàng gửi lên server!");
    // TODO: gửi dữ liệu
  };

  return (
      <div className="flex flex-col gap-4">
        {/* Ảnh sản phẩm */}
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="mb-1 text-sm font-medium">Ảnh chính</p>
            <ImageDropZone value={mainImage} onChange={setMainImage} size={290} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Ảnh phụ</p>
            <div className="grid grid-cols-4 gap-2">
              {subImages.map((file, index) => (
                  <ImageDropZone
                      key={index}
                      value={file}
                      onChange={(f) => handleSubImageChange(index, f)}
                      size={140}
                  />
              ))}
            </div>
          </div>
        </div>

        {/* Tên sản phẩm */}
        <div>
          <Label>
            Tên sản phẩm <span className="text-error-500">*</span>
          </Label>
          <Input
              placeholder="Tên sản phẩm"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
          />
        </div>

        {/* Mô tả */}
        <div>
          <Label>
            Mô tả <span className="text-error-500">*</span>
          </Label>
          <TextArea
              value={description}
              onChange={(value) => setDescription(value)}
              rows={6}
              className={errors.description ? "border-red-500" : ""}
          />
        </div>
      </div>
  );
});

export default BasicInfoProductForm;
