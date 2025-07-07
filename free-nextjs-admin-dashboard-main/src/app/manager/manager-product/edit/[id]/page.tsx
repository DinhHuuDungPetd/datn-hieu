import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditProductForm from "@/components/product/EditProductForm";

export default function Page(){

  return (
      <div>
        <PageBreadcrumb pageTitle="Thêm sản phẩm mới" />
        <EditProductForm />
      </div>
  )
}