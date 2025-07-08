"use client"
import {useRef, useEffect, useState} from "react";
import BasicInfoProductForm from "@/components/product/BasicInfoProductForm";
import AttributeProductForm from "@/components/product/AttributeProductForm";
import {Color, Size} from "@/api/Type";
import SalesInfoForm from "@/components/product/SalesInfoForm";
import Button from "@/components/ui/button/Button";
import {PackagePlus} from "lucide-react";
import {toast} from "react-toastify";
import {uploadImageToCloudinary} from "@/api/cloudinaryApi";
import {createProduct, getProductDetails} from "@/api/productApi";
import {useParams} from "next/navigation";
import {
  extractAttributesFromProductItems,
  ExtractedImages,
  extractImagesFromProduct
} from "@/heppler/extractImagesFromProduct";


const SECTIONS = [
  { id: "basic-info", label: "Thông tin cơ bản" },
  { id: "product-details", label: "Thuộc tính sản phẩm" },
  { id: "sales-info", label: "Giá & kho" }
];

export type Variant = {
  color: Color;
  image: File | null;
  size: Size
  price: number | null;
  quantity: number | null;
};

export default function EditProductForm() {

  const params = useParams();
  const productId = params?.id as string;
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Scrollspy logic
  useEffect(() => {
    (async () =>{
      const productDetails = await getProductDetails(productId);

      const { mainImageUrl, subImageUrls } : ExtractedImages = extractImagesFromProduct(productDetails.images);
      setBasicInfo({
        mainImageUrl,
        subImageUrls,
        productName: productDetails.productName,
        description: productDetails.description,
      })
      const attributes = await extractAttributesFromProductItems(productDetails.productItems);
      setAttributes(attributes);
    })()
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for sticky header
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const ref = sectionRefs.current[section.id];
        if (ref) {
          const { top } = ref.getBoundingClientRect();
          if (top + window.scrollY - 100 <= scrollPosition) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (attributes) {
      const newVariants = generateVariants();
      setVariants(newVariants);
    }
  }, [attributes]);



  const handleSubmit = async () => {
    if (!basicInfo || !attributes) {
      console.warn("Chưa nhập đủ thông tin");
      return;
    }
    const {
      productName,
      description,
      mainImage,
      subImages,
    } = basicInfo;

    const errors: {
      productName?: string;
      description?: string;
      image?: string;
      sizes?: string;
      colors?: string;
      variants?: string;
    } = {};
    if (!productName?.trim()) {
      errors.productName = "Tên sản phẩm là bắt buộc.";
    }
    // Validate mô tả
    if (!description?.trim()) {
      errors.description = "Mô tả không được để trống.";
    }
    // Validate ảnh
    const hasAtLeastOneImage =
        !!mainImage || subImages.some((img: any) => img !== null);
    if (!hasAtLeastOneImage) {
      errors.image = "Bạn cần chọn ít nhất 1 ảnh cho sản phẩm.";
    }
    const errorMessage = validateVariants(variants);
    if (errorMessage) {
      errors.variants = errorMessage;
    }

    const isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      console.warn("Form không hợp lệ:", errors);
      Object.values(errors)
      .filter((msg) => !!msg)
      .forEach((msg) => toast.error(msg));
      return;
    }

    setIsSubmitting(true); // 👉 Bắt đầu loading
    try{
      const images : {
        url: string;
        isMain: boolean;
      } []= await buildImages(mainImage, subImages);
      const productItems : {
        colorId: string;
        sizeId: string;
        price: number;
        quantity: number;
        imageUrl: string | null;
        active: boolean;
      }[]= await buildProductItems(variants);
      const productRequest: any = {
        productName,
        description,
        images,
        productItems,
      };
      await createProduct(productRequest);
      toast.success("Thành công!");
    }catch(error){
      console.log(error)
      toast.error("có lỗi xảy ra!");
    }finally {
      setIsSubmitting(false);
    }
  };

  const buildImages = async (main: File, subs: File[]) => {
    const images : {
      url: string;
      isMain: boolean;
    } []= [];
    const mainImageUrl = await uploadImageToCloudinary(main);
    images.push({
      url : mainImageUrl,
      isMain: true,
    });
    const subImageUrls = await Promise.all(
        subs
        .filter((img: any) => img !== null)
        .map((img: any) => uploadImageToCloudinary(img!))
    );
    subImageUrls.forEach(url =>{
      images.push({
        url,
        isMain: false,
      });
    })
    return images;
  }
  const buildProductItems = async (variants: Variant[]) => {
    const productItems : {
      colorId: string;
      sizeId: string;
      price: number;
      quantity: number;
      imageUrl: string | null;
      active: boolean;
    }[]= []
    for (const variant of variants) {
      let imageUrl = null;
      if(variant.image){
        imageUrl = await uploadImageToCloudinary(variant.image);
      }
      productItems.push({
        colorId: variant.color.id,
        sizeId: variant.size.id,
        imageUrl,
        quantity: variant?.quantity?? 0,
        active: true,
        price: variant?.price ?? 0
      })
    }
    return productItems;
  }


  const validateVariants = (variants: Variant[]): string | null => {
    if (!variants || variants.length === 0) {
      return "Cần ít nhất 1 biến thể.";
    }
    // Kiểm tra price và quantity
    for (const v of variants) {
      if (v.price == null || v.price < 0) {
        return `Giá của biến thể màu ${v.color.name} - size ${v.size.name} không hợp lệ.`;
      }
      if (v.quantity == null || v.quantity < 0) {
        return `Tồn kho của biến thể màu ${v.color.name} - size ${v.size.name} không hợp lệ.`;
      }
    }
    // Kiểm tra đồng nhất ảnh
    const hasAnyImage = variants.some((v) => v.image !== null);
    const allHaveImages = variants.every((v) => v.image !== null);
    if (hasAnyImage && !allHaveImages) {
      return "Nếu một biến thể có ảnh thì tất cả biến thể còn lại cũng phải có ảnh.";
    }
    return null; // Hợp lệ
  };

  const generateVariants = () => {
    if (!attributes) return [];
    const { selectedSizes, selectedColors } = attributes;

    const variants: Variant[] = [];
    selectedColors.forEach((color: any) => {
      selectedSizes.forEach((size: any) => {
        const variant: Variant =  {
          color: color?.color ?? null,
          size : size,
          image: color.image,
          price: 0,
          quantity: 0,
        }
        variants.push(variant);
      })
    })
    return variants;
  };
  return (
      <div>
        <div className="flex justify-end items-center mb-2">
          <Button size={"xs"} variant={"add"} startIcon={<PackagePlus/>} onClick={handleSubmit}>Thêm</Button>
        </div>
        <div className="flex gap-8 w-full  mx-auto">
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
              <h2 className="font-semibold text-lg mb-4">Thông tin cơ bản</h2>
              <BasicInfoProductForm onChange={setBasicInfo} initialData={basicInfo} />
            </div>

            {/* Section: Product details */}
            <div
                id="product-details"
                ref={el => { sectionRefs.current["product-details"] = el; }}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Thuộc tính sản phẩm</h2>
              <AttributeProductForm onChange={setAttributes} initialData={attributes} />
            </div>
            {/* Section: Sales information */}
            <div
                id="sales-info"
                ref={el => { sectionRefs.current["sales-info"] = el; }}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Giá & kho</h2>
              <SalesInfoForm
                  variants={variants}
                  onChange={setVariants}
              />
            </div>
          </div>
        </div>
        {isSubmitting && (
            <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-300 bg-opacity-40">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-sm font-medium">Đang xử lý, vui lòng đợi...</span>
              </div>
            </div>
        )}
      </div>
  );
}