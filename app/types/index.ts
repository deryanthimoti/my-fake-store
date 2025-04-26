export type ShoppingCart = {
  id: number;
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
  }[];
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
};