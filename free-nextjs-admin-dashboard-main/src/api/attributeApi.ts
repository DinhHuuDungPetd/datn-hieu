import AxiosInstance from "@/until/AxiosInstance";
import {ApiResponse, Attribute, Product} from "@/api/Type";

export async function getAttributeProduct(): Promise<Attribute> {
  try {
    const response = await AxiosInstance.get("/manager/product/get-attributes");
    return response.data.result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}