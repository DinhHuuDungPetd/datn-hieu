import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateProductForm from "@/components/product/CreateProductForm";

export default function Page(){

  return (
      <div>
        <PageBreadcrumb pageTitle="Thêm sản phẩm mới" />
        <CreateProductForm/>
      </div>
  )
}