import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Post from "@/components/pos/pos";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bán hàng" />
      <Post />
    </div>
  );
}
