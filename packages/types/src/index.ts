export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  tokenVersion: number;
  blockedReason?: string;
  createdAt: string | Date;
}

export interface ISecuritySetting {
  _id?: string;
  isLockdownMode: boolean;
  blacklistedIPs: string[];
}

export type ProductGender = 'men' | 'women' | 'unisex' | 'kids';
export type ProductShape = 'rectangle' | 'round' | 'cat-eye' | 'aviator' | 'square';

export interface IProduct {
  _id: string;
  title: string;
  brand: string;
  modelCode: string;
  gender: ProductGender;
  shape: ProductShape;
  material: string;
  price: number;
  stockCount: number;
  images: string[];
  isActive: boolean;
  createdAt?: string | Date;
}

export interface IPrescription {
  _id?: string;
  userId?: string;
  patientName: string;
  phone: string;
  sphere_OD: number;
  sphere_OS: number;
  cylinder_OD: number;
  cylinder_OS: number;
  axis_OD: number;
  axis_OS: number;
  add_power: number;
  pupillaryDistance: number;
  prescriptionFileUrl?: string;
  notes?: string;
  createdAt?: string | Date;
}

export type LensType = 'single-vision' | 'bifocal' | 'progressive' | 'blue-cut';
export type OrderStatus = 'Pending' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'cash' | 'card' | 'online';

export interface IOrderItem {
  productId: string | IProduct;
  framePrice: number;
  lensType: LensType;
  lensPrice: number;
  prescriptionData?: Partial<IPrescription>;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId?: string | IUser;
  customerName: string;
  customerPhone: string;
  items: IOrderItem[];
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  isWalkIn: boolean;
  createdAt: string | Date;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IAppointment {
  _id: string;
  patientName: string;
  phone: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string | Date;
}

export interface IAnalyticsOverview {
  totalRevenue: number;
  totalAdvanceCollected: number;
  totalBalanceDue: number;
  totalOrders: number;
  pendingOrders: number;
  readyForPickupOrders: number;
  completedOrders: number;
  chartData: Array<{
    label: string;
    grossSales: number;
    advancePaid: number;
    balanceDue: number;
    ordersCount: number;
  }>;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: IUser;
}
