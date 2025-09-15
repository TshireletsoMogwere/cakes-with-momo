export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  images: { src: string; alt?: string }[];
  variants: { id: number; title: string; price: string }[];
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('https://cakes-with-momo.myshopify.com/products.json');
  const data = await res.json();
  return data.products;
};
