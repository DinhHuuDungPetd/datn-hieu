import AxiosInstance from "@/until/AxiosInstance";
import {ApiResponse, LoginRequest, UserResponse} from "@/api/Type";

async function login(request: LoginRequest) {
  const response = await AxiosInstance
                    .post<ApiResponse<UserResponse>>("/login", request);

  console.log(response);
}

export default login;