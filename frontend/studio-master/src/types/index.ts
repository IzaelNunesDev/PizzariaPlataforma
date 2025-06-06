export type MenuCategory = 'pizza' | 'sides' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  imageHint?: string;
}
