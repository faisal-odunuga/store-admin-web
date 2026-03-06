export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category?: string;
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  stock: number;
  lowStockAlert: number;
  weight?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // UI computed status
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
