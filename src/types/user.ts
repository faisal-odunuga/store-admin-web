export interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  createdAt: string;
  updatedAt: string;
  // UI computed fields
  setupComplete?: boolean;
  initials?: string;
  ordersCount?: number;
  totalSpent?: number;
  status?: 'Active' | 'New' | 'VIP' | 'Inactive';
}
