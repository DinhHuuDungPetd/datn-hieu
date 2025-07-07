type ApiResponse<T> = {
  status: number;
  message: string;
  result: T;
};

type LoginRequest = {
  email: string;
  password: string;
}
type UserResponse = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

export type ProductImage = {
  id: string;
  url: string;
  isMain: boolean;
};
export type ProductItem = {
  id: string;
  color: Color;
  size: Size;
  price: number;
  quantity: number;
  imageUrl: string | null;
  createdAt: string | null;
  updatedAt: string;
  createdBy: string;
};


export type Color = {
  id: string;
  name: string;
};

export type Size = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  productName: string;
  description: string;
  mainImageUrl: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ProductDetails = {
  id: string;
  productName: string;
  description: string;
  images: ProductImage []
  productItems: ProductItem [],
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Attribute ={
  colors: Color[];
  sizes: Size[];
}

export interface Page<T> {
  content: T[];               // Danh sách kết quả
  totalElements: number;      // Tổng số phần tử
  totalPages: number;         // Tổng số trang
  number: number;             // Trang hiện tại (0-based)
  size: number;               // Kích thước trang (số phần tử mỗi trang)
  numberOfElements: number;   // Số phần tử trong trang hiện tại
  first: boolean;             // Có phải trang đầu không
  last: boolean;              // Có phải trang cuối không
  empty: boolean;             // Trang có rỗng không
}


export type { ApiResponse , UserResponse , LoginRequest};