export type Category = "Audio" | "Hogar" | "Movilidad" | "Escritorio";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  stock: number;
  description: string;
  accent: string;
  deliveryNode: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface RouteResult {
  path: number[];
  cost: number;
}

export interface Order {
  id: string;
  createdAt: string;
  address: DeliveryAddress;
  items: CartItem[];
  total: number;
  route: RouteResult;
}

export type DistanceMatrix = number[][];

