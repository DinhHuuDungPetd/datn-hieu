import { ApiResponse, Page, Product, ProductDetails } from "@/api/Type";
import AxiosInstance from "@/until/AxiosInstance";
import { ProductSearchRequest } from "@/components/product/ProductTable";

function extractErrorMessage(error: any): string {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return "Có lỗi xảy ra";
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await AxiosInstance.get<ApiResponse<Product[]>>("/manager/product");
    return response.data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const searchProduct = async (
    pageNumber: number,
    size: number,
    body: ProductSearchRequest
): Promise<Page<Product>> => {
  try {
    const response = await AxiosInstance.post<ApiResponse<Page<Product>>>(
        `/manager/product/search?size=${size}&pageNumber=${pageNumber}`,
        body
    );
    return response.data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createProduct = async (product: any): Promise<Product> => {
  try {
    const response = await AxiosInstance.post<ApiResponse<Product>>(`/manager/product`, product);
    return response.data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getProductDetails = async (productId: string): Promise<ProductDetails> => {
  try {
    const response = await AxiosInstance.get<ApiResponse<ProductDetails>>(`/manager/product/${productId}`);
    return response.data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateStatus = async (productId: string, status: string): Promise<Product> => {
  try {
    const response = await AxiosInstance.put<ApiResponse<Product>>(
        `/manager/product/${productId}/change-status?status=${status}`
    );
    return response.data.result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
