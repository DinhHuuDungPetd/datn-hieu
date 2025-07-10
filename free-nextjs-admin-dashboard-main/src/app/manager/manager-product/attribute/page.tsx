import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AttributeManager from "@/components/attributes/Attribute";

export default function Page(){

  return (
      <div>
        <PageBreadcrumb pageTitle="Thuộc tính sản phẩm" />
        <AttributeManager/>
      </div>
  )
}