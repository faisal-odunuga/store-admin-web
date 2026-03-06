import { Product } from './product';
import { User } from './user';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  profitAmount?: number;
  shippingAddress: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  orderItems?: OrderItem[];
}
