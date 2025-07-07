import {ApiResponse, Page, Product, ProductDetails} from "@/api/Type";
import AxiosInstance from "@/until/AxiosInstance";
import {ProductSearchRequest} from "@/components/product/ProductTable";
import {Property} from "csstype";

export const getAllProducts = async () => {
  try {
    const response = await AxiosInstance
        .get<ApiResponse<Product[]>>("/manager/product")
    return response.data.result;
  }catch(error) {
    console.log(error);
  }
}
export const searchProduct = async (pageNumber:number, size:number, body :ProductSearchRequest) => {
  try {
    const response = await AxiosInstance
      .post<ApiResponse<Page<Product>>>(`/manager/product/search?size=${size}&pageNumber=${pageNumber}`,body);
    return response.data.result;
  }catch(error) {
    console.log(error);
  }
}

export const createProduct = async (product: any) => {
  try {
    const response = await AxiosInstance.post(`/manager/product`,product);
    return response.data.result;
  }catch(error) {
    console.log(error);
  }
}

export const getProductDetails = async (productId: string): Promise<ProductDetails> => {
  try {
    const response = await AxiosInstance.get<ApiResponse<ProductDetails>>(`/manager/product/${productId}`);
    return response.data.result;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể lấy chi tiết sản phẩm");
  }
};