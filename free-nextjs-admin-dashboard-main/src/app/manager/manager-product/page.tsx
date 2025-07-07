import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import ProductTable from "@/components/product/ProductTable";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function ProuctManager() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Sản phẩm" />
        <ProductTable />
    </div>
  );
}

