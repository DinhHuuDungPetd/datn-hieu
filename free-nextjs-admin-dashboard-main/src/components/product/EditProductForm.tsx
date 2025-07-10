"use client"
import {useRef, useEffect, useState, useCallback} from "react";
import BasicInfoProductForm from "@/components/product/BasicInfoProductForm";
import AttributeProductForm from "@/components/product/AttributeProductForm";
import {Color, Size} from "@/api/Type";
import SalesInfoForm from "@/components/product/SalesInfoForm";
import Button from "@/components/ui/button/Button";
import {PackagePlus} from "lucide-react";
import {toast} from "react-toastify";
import {uploadImageToCloudinary} from "@/api/cloudinaryApi";
import {updateProduct, getProductDetails} from "@/api/productApi";
import {useParams , useRouter} from "next/navigation";
import {
  extractAttributesFromProductItems,
  ExtractedImages,
  extractImagesFromProduct,
  urlToFile,
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
  const router = useRouter();

  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initBaseInfo, setInitBaseInfo] = useState<any>(null);
  const [initAttribute, setInitAttribute] = useState<any>(null);

  // Fill form data from API
  useEffect(() => {
    let isMounted = true;
    async function fetchAndFill() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const productDetails = await getProductDetails(productId);
        // Extract images for BasicInfoProductForm
        const { mainImageUrl, subImageUrls }: ExtractedImages = extractImagesFromProduct(productDetails.images);
        // Extract attributes for AttributeProductForm
        const attributesData = await extractAttributesFromProductItems(productDetails.productItems);
        // Prepare variants: ensure image is File|null
        const variantPromises = productDetails.productItems.map(async (item: any) => {
          let image: File | null = null;
          if (item.imageUrl) {
            try {
              image = await urlToFile(item.imageUrl, `variant-${item.color.id}-${item.size.id}.jpg`);
            } catch (e) {
              // Nếu lỗi vẫn cho null, không crash
              image = null;
            }
          }
          return {
            color: item.color,
            size: item.size,
            image,
            price: item.price ?? 0,
            quantity: item.quantity ?? 0,
          };
        });
        const variantsData = await Promise.all(variantPromises);
        if (!isMounted) return;
        setInitBaseInfo({
          mainImageUrl,
          subImageUrls,
          productName: productDetails.productName,
          description: productDetails.description,
        });
        setInitAttribute(attributesData);
        setVariants(variantsData);
      } catch (err: any) {
        setLoadError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
        setBasicInfo(null);
        setAttributes(null);
        setVariants([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndFill();
    return () => { isMounted = false; };
  }, [productId]);

  // Khi attributes thay đổi (user chỉnh thuộc tính), sinh lại variants (giống create)
  useEffect(() => {
    if (!attributes) return;
    // Nếu đang loading từ API thì không generate lại
    if (isLoading) return;
    // Nếu user chỉnh thuộc tính, generate lại variants
    const { selectedSizes, selectedColors } = attributes;
    if (!selectedSizes || !selectedColors) return;
    const newVariants: Variant[] = [];
    selectedColors.forEach((color: any) => {
      selectedSizes.forEach((size: any) => {
        // Nếu đã có variant cũ, giữ lại price/quantity/image
        const old = variants.find(
          (v) => v.color.id === color.color.id && v.size.id === size.id
        );
        newVariants.push({
          color: color.color,
          size,
          image: color.image ?? old?.image ?? null,
          price: old?.price ?? 0,
          quantity: old?.quantity ?? 0,
        });
      });
    });
    setVariants(newVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await updateProduct(productId, productRequest);
      router.push(`/manager/manager-product`);
    }catch(error){
      console.log(error)
      toast.error("có lỗi xảy ra!");
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleBasicInfoChange = useCallback((data: any) => setBasicInfo(data), []);
  const handleAttributesChange = useCallback((data: any) => setAttributes(data), []);
  const handleVariantsChange = useCallback((data: any) => setVariants(data), []);

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
      {isLoading && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-300 bg-opacity-40">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm font-medium">Đang tải dữ liệu sản phẩm...</span>
          </div>
        </div>
      )}
      {loadError && (
        <div className="text-center text-red-600 font-semibold my-8">{loadError}</div>
      )}
      <div className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        <div className="flex justify-end items-center mb-2">
          <Button size={"xs"} variant={"add"} startIcon={<PackagePlus/>} onClick={handleSubmit} disabled={isLoading}>Lưu</Button>
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
              <BasicInfoProductForm onChange={handleBasicInfoChange} initialData={initBaseInfo} />
            </div>
            {/* Section: Product details */}
            <div
              id="product-details"
              ref={el => { sectionRefs.current["product-details"] = el; }}
              className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Thuộc tính sản phẩm</h2>
              <AttributeProductForm onChange={handleAttributesChange} initialData={initAttribute} />
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
                onChange={handleVariantsChange}
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
    </div>
  );
}