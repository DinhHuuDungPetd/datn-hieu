'use client'
import Input from "@/components/form/input/InputField";
import {useState} from "react";
import Button from "@/components/ui/button/Button";
import {Plus} from "lucide-react";
import TableCart from "@/components/pos/TableCart";

// Mock data cho sản phẩm
const mockProducts = [
  { id: "1", name: "Sản phẩm A", code: "A001" },
  { id: "2", name: "Sản phẩm B", code: "B002" },
  { id: "3", name: "Sản phẩm C", code: "C003" },
  { id: "4", name: "Sản phẩm D", code: "D004" },
  { id: "5", name: "Sản phẩm E", code: "E005" },
];

export default function Post() {
    const [customerSearchName, setCustomerSearchName] = useState<string>("");
    const [productSearchName, setProductSearchName] = useState<string>("");
    const [selectedMethod, setSelectedMethod] = useState("Bank");
    const [searchResults, setSearchResults] = useState<typeof mockProducts>([]);
    const [showResults, setShowResults] = useState(false);

    // Hàm tìm kiếm sản phẩm
    const handleProductSearch = (value: string) => {
      setProductSearchName(value);
      if (value.trim() === "") {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      const results = mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.code.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    };

    // Khi chọn sản phẩm
    const handleSelectProduct = (product: typeof mockProducts[0]) => {
      // TODO: Thêm vào giỏ hàng nếu cần
      setProductSearchName("");
      setShowResults(false);
      setSearchResults([]);
    };

  return(
      <div className="bg-white border-2 rounded-md flex h-[80vh]">
          {/* Cột sản phẩm */}
          <div className="w-[60%] border-r border-gray-300 p-4 overflow-y-auto h-full flex flex-col">
              <div className="flex-1 mb-2">
                  <div className="relative">
                    <Input
                        value={productSearchName}
                        placeholder="Nhập tên hoặc mã"
                        type="text"
                        onChange={(e) => handleProductSearch(e.target.value)}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    />
                    {showResults && searchResults.length > 0 && (
                      <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectProduct(product)}
                          >
                            {product.name} - {product.code}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
              </div>
              <div className="flex-1">
                  <TableCart />
              </div>
          </div>

          {/* Cột thông tin */}
          <div className="w-[40%] p-4 flex flex-col h-full overflow-y-auto">
              {/* PHẦN TRÊN: KHÁCH HÀNG + GIỎ HÀNG */}
              <div className="flex flex-col gap-6">
                  {/* Tìm kiếm khách hàng */}
                  <div className="flex gap-2">
                     <div className="flex-1">
                         <Input
                             value={customerSearchName}
                             placeholder="Tìm kiếm khách hàng"
                             type="text"
                             onChange={(e) => setCustomerSearchName(e.target.value)}
                         />
                     </div>
                      <Button
                          type="button"
                          variant="add"
                          size="md"
                          startIcon={<Plus size={18} />}
                          children={""}
                      />
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="text-sm space-y-1">
                      <p><strong>Tên KH:</strong> Đinh Hữu Dũng</p>
                      <p><strong>Mã KH:</strong> 123456</p>
                      <p><strong>SĐT:</strong> 0987654321</p>
                  </div>

                  {/* Bảng giỏ hàng */}
              </div>

              {/* PHẦN DƯỚI: THANH TOÁN */}
              <div className="mt-auto pt-4">
                  <div className="p-4 font-handdrawn space-y-4 ">
                      <div className="flex justify-between">
                          <span>Tổng tiền</span>
                          <span>400.000</span>
                      </div>

                      <div className="flex justify-between">
                          <span>Giảm giá</span>
                          <span>-50.000</span>
                      </div>

                      <div className="flex justify-between font-bold">
                          <span>Thanh toán</span>
                          <span>350.000</span>
                      </div>

                      <div className="flex justify-center gap-4 pt-2">
                          {["Bank", "Tiền mặt"].map((method) => (
                              <button
                                  key={method}
                                  className={`border px-4 py-1 rounded-md ${
                                      selectedMethod === method
                                          ? "bg-red-100 border-red-600 font-semibold"
                                          : ""
                                  }`}
                                  onClick={() => setSelectedMethod(method)}
                              >
                                  {method}
                              </button>
                          ))}
                      </div>

                      <div className="pt-4">
                          <button
                              className="w-full border border-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition"
                          >
                              Thanh toán
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}