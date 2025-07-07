"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge, {BadgeColor} from "../ui/badge/Badge";
import {Product} from "@/api/Type";
import React, {useEffect, useState} from "react";
import { searchProduct} from "@/api/productApi";
import {formatCurrencyVND} from "@/heppler/convertMony";
import ActionMutiDropDown from "@/components/product/ActionMutiDropDown";
import {toast} from "react-toastify";
import Input from "@/components/form/input/InputField";
import Button from "../ui/button/Button";
import {PackagePlus, ScanSearch} from "lucide-react";
import {BoxIcon} from "@/icons";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";

function getStatusColor(status: string): BadgeColor {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'OUT_OF_STOCK':
      return 'warning';
    case 'INACTIVE':
      return 'error';
    case 'DRAFT':
    default:
      return 'dark';
  }
}

export interface ProductSearchRequest {
  id?: string;
  keyword?: string;
  status?: string;
  colorIds?: string[];
  sizeIds?: string[];
  minPrice?: number;
  maxPrice?: number;
}

const statuses = [
  { label: "Tất cả", value: "" },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Ngừng bán", value: "INACTIVE" },
  { label: "Hết hàng", value: "OUT_OF_STOCK" },
];

export default function ProductTable() {
  const  [products, setProducts] = useState<Product[]>([]);
  const [bodySearch, setBodySearch] = useState<ProductSearchRequest>({});
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(()=>{
    (async () =>{
      try {
        console.log("search:", bodySearch);
        const pageResponse  = await searchProduct(currentPage, pageSize, bodySearch);
        console.log(pageResponse);
        setProducts(pageResponse?.content ?? []);
        setCurrentPage(pageResponse?.number ?? 0);
        setTotalPages(pageResponse?.totalPages ?? 0);
      }catch (e){
        toast.error("Có lỗi xảy ra!");
        console.error(e);
      }
    })();
  },[bodySearch, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setCurrentPage(page -1);
  };


  const changeStatus = (status: string) => {
    setBodySearch((prev) => {
      const newSearch = { ...prev };
      if (status) {
        newSearch.status = status;
      } else {
        delete newSearch.status;
      }
      return newSearch;
    });
  }

  const selectStatusActive = (status: string) => {
    if (!status && !bodySearch.status) return "primary"; // chọn "Tất cả"
    return bodySearch.status === status ? "primary" : "light";
  };

  const handleSearch = () => {
    setBodySearch((prev) => {
      const newSearch = { ...prev };
      newSearch.keyword = search;
      newSearch.id = search;
      return newSearch;
    });
  }

  const resetSearch = () => {
    setSearch("");
    setBodySearch({})
  }
  return (
    <div>
      <Link href={"/manager/manager-product/create-product"} >
        <Button size="xs" variant="add" endIcon={<PackagePlus size={16} />}>
         Thêm mới
        </Button>
      </Link>
      <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[70vh] mt-2">
        <div className=" mb-2 flex flex-col gap-4 mb-2  bg-transparent ">
          <div className="flex justify-end items-center gap-2">
            <div className="w-[400px]">
              <Input
                  type="text"
                  placeholder="Nhập tên hoặc id sản phẩm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button
                size={"sm"}
                startIcon={<ScanSearch size={18} />}
                onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </div>
          <div className="flex justify-between items-center gap-2">
            <ul className="flex gap-2 text-xs cursor-pointer">
              {statuses.map((status) => (
                  <li  key={status.value} onClick={() => changeStatus(status.value)}>
                    <Badge
                        size="md"
                        color={selectStatusActive(status.value)}
                    >
                      {status.label}
                    </Badge>
                  </li>
              ))}
            </ul>
            <div className="cursor-default" onClick={resetSearch} >
              <Badge
                  size="md"
                  color={"success"}
              >
                Reset
              </Badge>
            </div>
          </div>
        </div>
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-visible">
            <div className="min-w-[1102px]">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên sản phẩm
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Giá
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Số lượng
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {products.map(( product) => (
                      <TableRow key={product.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full">
                              <img
                                  width={40}
                                  height={40}
                                  src={product.mainImageUrl}
                                  alt={product.productName}
                              />
                            </div>
                            <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.productName}
                        </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                         ID: {product.id}
                        </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {`${formatCurrencyVND(product.minPrice)} - ${formatCurrencyVND(product.maxPrice)}`}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex -space-x-2">
                            {product.quantity}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                              size="sm"
                              color={getStatusColor(product.status)}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 relative">
                          <ActionMutiDropDown productId={product.id}/>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex  gap-3">
        <Pagination  currentPage={currentPage + 1} totalPages={totalPages} onPageChange={handlePageChange} />
        <div>
          <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setCurrentPage(0); // Reset về trang đầu
              }}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}
