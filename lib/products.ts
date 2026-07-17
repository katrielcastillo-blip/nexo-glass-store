import { Product } from "@/types/store";

export const products: Product[] = [
  { id: 1, name: "Auriculares Halo", category: "Audio", price: 129.9, image: "/product-placeholder.svg", stock: 8, description: "Audio espacial y 32 h de autonomía.", accent: "#57d8ff", deliveryNode: 1 },
  { id: 2, name: "Parlante Orbit", category: "Audio", price: 89.5, image: "/product-placeholder.svg", stock: 14, description: "Sonido 360° resistente al agua.", accent: "#b8ff5c", deliveryNode: 2 },
  { id: 3, name: "Lámpara Nébula", category: "Hogar", price: 64, image: "/product-placeholder.svg", stock: 11, description: "Luz ambiente regulable con gesto.", accent: "#ffbd7a", deliveryNode: 3 },
  { id: 4, name: "Difusor Bruma", category: "Hogar", price: 49.9, image: "/product-placeholder.svg", stock: 17, description: "Aromas silenciosos para 30 m².", accent: "#e0a7ff", deliveryNode: 4 },
  { id: 5, name: "Mochila Transit", category: "Movilidad", price: 78, image: "/product-placeholder.svg", stock: 9, description: "Tejido reciclado y acceso magnético.", accent: "#57d8ff", deliveryNode: 5 },
  { id: 6, name: "Botella Flux", category: "Movilidad", price: 34.5, image: "/product-placeholder.svg", stock: 22, description: "Mantiene la temperatura por 18 horas.", accent: "#b8ff5c", deliveryNode: 1 },
  { id: 7, name: "Teclado Lumen", category: "Escritorio", price: 112, image: "/product-placeholder.svg", stock: 6, description: "Perfil bajo, mecánico y silencioso.", accent: "#ffbd7a", deliveryNode: 2 },
  { id: 8, name: "Mouse Vector", category: "Escritorio", price: 69, image: "/product-placeholder.svg", stock: 13, description: "Precisión inalámbrica ultraligera.", accent: "#e0a7ff", deliveryNode: 3 },
  { id: 9, name: "Base Fold", category: "Escritorio", price: 44, image: "/product-placeholder.svg", stock: 19, description: "Aluminio plegable para cualquier portátil.", accent: "#57d8ff", deliveryNode: 4 },
  { id: 10, name: "Cargador Pulse", category: "Movilidad", price: 55, image: "/product-placeholder.svg", stock: 16, description: "Carga GaN rápida con tres puertos.", accent: "#b8ff5c", deliveryNode: 5 },
];

export const categories = ["Todos", "Audio", "Hogar", "Movilidad", "Escritorio"] as const;

