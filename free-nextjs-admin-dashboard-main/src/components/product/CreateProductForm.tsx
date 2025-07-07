"use client"
import Button from "@/components/ui/button/Button";
import { PackagePlus } from "lucide-react";
import React, { useRef, useEffect, useState, useMemo } from "react";
import DropImageProduct from "./DropImageProduct";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import {ChevronDownIcon} from "@/icons";
import TextArea from "@/components/form/input/TextArea";
import MultiSelect from "@/components/form/MultiSelect";
import Checkbox from "@/components/form/input/Checkbox";
import {getAttributeProduct} from "@/api/attributeApi";
import { Color, Size } from "@/api/Type";
import ProductVariantTable from "./ProductVariantTable";
import { createProduct } from "@/api/productApi";
import { uploadImageToCloudinary } from "@/api/cloudinaryApi";

const IMAGE_SLOT_COUNT = 9;

const options = [
  { value: "marketing", label: "Marketing" },
  { value: "template", label: "Template" },
  { value: "development", label: "Development" },
];

const SECTIONS = [
  { id: "basic-info", label: "Basic information" },
  { id: "product-details", label: "Product details" },
  { id: "sales-info", label: "Sales information" }
];

export default function CreateProductForm() {
  const [images, setImages] = useState<(File | null)[]>(Array(IMAGE_SLOT_COUNT).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(Array(IMAGE_SLOT_COUNT).fill(null));
  const [productName, setProductName] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Size[]>([]);
  const [colorFields, setColorFields] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Clean up previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleDrop = React.useCallback(
    (index: number) => (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const newImages = [...images];
        const newPreviews = [...previews];
        if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
        newImages[index] = acceptedFiles[0];
        newPreviews[index] = URL.createObjectURL(acceptedFiles[0]);
        setImages(newImages);
        setPreviews(newPreviews);
      }
    },
    [images, previews]
  );

  const handleRemove = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Scrollspy logic
  useEffect(() => {
    (async () => {
      const attribute = await getAttributeProduct();
      setColorOptions(attribute.colors || []);
      setSizeOptions(attribute.sizes || []);
      // Khởi tạo colorFields từ API
      setColorFields((attribute.colors || []).map((c: any) => ({
        value: c.id,
        name: c.name,
        checked: false,
        image: null,
        preview: null
      })));
    })();

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for sticky header
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const ref = sectionRefs.current[section.id];
        if (ref) {
          const { top } = ref.getBoundingClientRect();
          if (top + window.scrollY - 130 <= scrollPosition) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tạo tổ hợp biến thể từ màu và size đã chọn
  const variantCombinations = useMemo(() => {
    const selectedColors = colorFields.filter(c => c.checked);
    if (selectedColors.length === 0 || selectedSizes.length === 0) return [];
    return selectedColors.flatMap(color =>
      selectedSizes.map(sizeId => {
        const sizeObj = sizeOptions.find(s => s.id === sizeId);
        return { color: color.value, colorName: color.name, size: sizeId, sizeName: sizeObj?.name || sizeId };
      })
    );
  }, [colorFields, selectedSizes, sizeOptions]);

  // State cho giá và số lượng từng biến thể
  const [variantData, setVariantData] = useState<{ [key: string]: { price: string; quantity: string } }>({});

  const handleVariantChange = (key: string, field: "price" | "quantity", value: string) => {
    setVariantData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  // State cho khối điền tổng
  const [bulkSize, setBulkSize] = useState('all');
  const [bulkColor, setBulkColor] = useState('all');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkQty, setBulkQty] = useState('');

  const handleBulkApply = () => {
    setVariantData(prev => {
      const updated = { ...prev };
      variantCombinations.forEach(({ color, size }) => {
        const matchSize = bulkSize === 'all' || size === bulkSize;
        const matchColor = bulkColor === 'all' || color === bulkColor;
        if (matchSize && matchColor) {
          const key = `${color}_${size}`;
          updated[key] = {
            price: bulkPrice !== '' ? bulkPrice : (updated[key]?.price || ''),
            quantity: bulkQty !== '' ? bulkQty : (updated[key]?.quantity || ''),
          };
        }
      });
      return updated;
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
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
    setFormErrors(errors);
    return errors.length === 0 ? { productName, description, images: imageList, productItems } : null;
  };

  const handleSubmit = async () => {
    // Upload ảnh sản phẩm lên Cloudinary
    const uploadedImageUrls: (string | null)[] = await Promise.all(images.map(async (file) => {
      if (file) return await uploadImageToCloudinary(file);
      return null;
    }));
    // Upload ảnh cho từng màu (nếu có)
    const uploadedColorFields = await Promise.all(colorFields.map(async (c) => {
      if (c.image) {
        const url = await uploadImageToCloudinary(c.image);
        return { ...c, preview: url };
      }
      return c;
    }));
    // Cập nhật state preview để validateForm dùng đúng URL cloud
    setPreviews(uploadedImageUrls);
    setColorFields(uploadedColorFields);

    // Validate lại với URL cloud
    const result = validateForm();
    if (result) {
      // eslint-disable-next-line no-console
      console.log("JSON submit:", JSON.stringify(result, null, 2));
      alert("Submit thành công! Xem console log.");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper lấy lỗi cho từng trường
  const getFieldError = (field: string) => formErrors.find(e => e.toLowerCase().includes(field.toLowerCase()));
  const getVariantError = (colorId: string, sizeId: string) => formErrors.filter(e => e.includes(`màu ${colorId}`) && e.includes(`size ${sizeId}`));

  return (
      <div>
        <div className="flex justify-end mt-8">
          <Button onClick={handleSubmit}  type="submit" size="sm" variant="add">Submit</Button>
        </div>
        <div className="flex gap-8 w-full max-w-[1200px] mx-auto">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 sticky top-24 self-start bg-white border border-gray-200 rounded-xl p-4 h-fit">
            <nav className="flex flex-col gap-2">
              {SECTIONS.map((section) => (
                  <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`px-3 py-2 rounded-lg transition font-medium text-sm cursor-pointer ${
                          activeSection === section.id
                              ? "bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                      }`}
                  >
                    {section.label}
                  </a>
              ))}
            </nav>
          </aside>
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Section: Basic information */}
            <div
                id="basic-info"
                ref={el => { sectionRefs.current["basic-info"] = el; }}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Basic information</h2>
              {/* Hiển thị lỗi tổng hợp đầu form nếu có lỗi không xác định trường */}
              {formErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                  <ul className="list-disc pl-5">
                    {formErrors.filter(e => !e.includes('màu') && !e.includes('size')).map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 w-fit p-4">
                {Array.from({ length: IMAGE_SLOT_COUNT }).map((_, idx) => (
                    <div key={idx}>
                      <DropImageProduct
                          preview={previews[idx]}
                          onDrop={handleDrop(idx)}
                          onRemove={() => handleRemove(idx)}
                          index={idx}
                      />
                      {/* Lỗi ảnh chính */}
                      {idx === 0 && getFieldError('ảnh chính') && (
                        <div className="text-xs text-red-500 mt-1">{getFieldError('ảnh chính')}</div>
                      )}
                      {/* Lỗi ảnh trùng nhau */}
                      {idx === 0 && getFieldError('trùng nhau') && (
                        <div className="text-xs text-red-500 mt-1">{getFieldError('trùng nhau')}</div>
                      )}
                    </div>
                ))}
              </div>
              <div className="mt-4">
                <Label>
                  Tên sản phẩm <span className="text-error-500">*</span>
                </Label>
                <Input
                    placeholder="Tên sản phẩm"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    error={!!getFieldError('tên sản phẩm')}
                    hint={getFieldError('tên sản phẩm')}
                />
              </div>
              <div className="w-[300px] mt-4">
                <Label>Danh mục sản phẩm</Label>
                <div className="relative">
                  <Select
                      options={options}
                      placeholder="Select Option"
                      onChange={() => null}
                      className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
                </div>
                </div>
                <div className="mt-4">
                  <Label>Description</Label>
                  <TextArea value={description} onChange={setDescription} rows={6} error={!!getFieldError('mô tả')} hint={getFieldError('mô tả')} />
                </div>
            </div>
            {/* Section: Product details */}
            <div
                id="product-details"
                ref={el => { sectionRefs.current["product-details"] = el; }}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Product details</h2>
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
              <div className="text-gray-400">(Nội dung chi tiết sản phẩm ở đây)</div>
            </div>
            {/* Section: Sales information */}
            <div
                id="sales-info"
                ref={el => { sectionRefs.current["sales-info"] = el; }}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Sales information</h2>
              {/* Khối điền tổng */}
              <div className="flex flex-wrap items-end gap-4 mb-6">
                <div className="w-40">
                  <Label>Chọn size</Label>
                  <select
                      className="w-full border rounded-lg px-2 py-2"
                      value={bulkSize}
                      onChange={e => setBulkSize(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {selectedSizes.map(sizeId => {
                      const sizeObj = sizeOptions.find(s => s.id === sizeId);
                      return (
                        <option key={sizeId} value={sizeId}>
                          {sizeObj ? sizeObj.name : sizeId}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="w-40">
                  <Label>Chọn màu</Label>
                  <select
                      className="w-full border rounded-lg px-2 py-2"
                      value={bulkColor}
                      onChange={e => setBulkColor(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {colorFields.filter(c => c.checked).map(color => (
                        <option key={color.value} value={color.value}>
                          {color.name}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <Label>Giá</Label>
                  <Input
                      type="number"
                      min="0"
                      value={bulkPrice}
                      onChange={e => setBulkPrice(e.target.value)}
                      placeholder="Giá"
                  />
                </div>
                <div className="w-28">
                  <Label>Số lượng</Label>
                  <Input
                      type="number"
                      min="0"
                      value={bulkQty}
                      onChange={e => setBulkQty(e.target.value)}
                      placeholder="Số lượng"
                  />
                </div>
                <Button size="sm" variant="primary" onClick={handleBulkApply}>Áp dụng</Button>
              </div>
              <div className="overflow-x-auto">
                <ProductVariantTable
                  variantCombinations={variantCombinations}
                  variantData={variantData}
                  handleVariantChange={handleVariantChange}
                  getVariantError={getVariantError}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}