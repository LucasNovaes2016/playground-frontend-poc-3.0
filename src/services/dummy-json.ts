import { dummyJsonApi } from "../api/dummyJsonApi";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export async function fetchProducts(
  limit: number = 10,
): Promise<ProductsResponse> {
  return dummyJsonApi.request<ProductsResponse>("/products", {
    params: { limit },
  });
}

export async function fetchProductsByCategory(
  category: string,
  limit: number = 10,
): Promise<ProductsResponse> {
  return dummyJsonApi.request<ProductsResponse>(
    `/products/category/${category}`,
    {
      params: { limit },
    },
  );
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  return dummyJsonApi.request<ProductCategory[]>("/products/categories");
}

export async function fetchProductById(id: number): Promise<Product> {
  return dummyJsonApi.request<Product>(`/products/${id}`);
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  return dummyJsonApi.request<ProductsResponse>("/products/search", {
    params: { q: query, limit: 10 },
  });
}
