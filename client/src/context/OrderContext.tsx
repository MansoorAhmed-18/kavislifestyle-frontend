import React, { createContext, useContext, useState, useEffect } from 'react';

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  price?: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: {
    customer: CustomerDetails;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, carrier?: string, trackingNumber?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (email?: string) => Order[];
}

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'KV-2026-98124',
    createdAt: '2026-02-28T14:30:00Z',
    customer: {
      name: 'Priyadarshini Sundaram',
      email: 'priya@kavislifestyle.com',
      phone: '+91 98400 12345',
      address: '14B, Alacrity Greens, 4th Main Road, Flat 202',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040'
    },
    items: [
      {
        id: 'item-1',
        name: 'Kanchipuram Pure Zari Bridal Silk Saree',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        variant: 'Bridal Crimson Red',
        quantity: 1,
        unitPrice: 9999,
        totalPrice: 9999
      },
      {
        id: 'item-2',
        name: 'King California Jumbo Almonds (Badam Giri)',
        image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=400&q=80',
        variant: '500g Value Pack',
        quantity: 2,
        unitPrice: 539,
        totalPrice: 1078
      }
    ],
    subtotal: 11077,
    discount: 1000,
    shipping: 0,
    total: 10077,
    paymentMethod: 'Online Payment (Razorpay)',
    paymentStatus: 'paid',
    status: 'shipped',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD-982341209IN'
  },
  {
    id: 'ord-102',
    orderNumber: 'KV-2026-98012',
    createdAt: '2026-02-20T11:15:00Z',
    customer: {
      name: 'Ananya Deshmukh',
      email: 'ananya.d@example.com',
      phone: '+91 97654 32100',
      address: '702, Prestige Towers, Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    items: [
      {
        id: 'item-3',
        name: 'Oud Al-Malik Luxury Pure Eau de Parfum',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
        variant: '100ml Royal Edition',
        quantity: 1,
        unitPrice: 3199,
        totalPrice: 3199
      }
    ],
    subtotal: 3199,
    discount: 0,
    shipping: 0,
    total: 3199,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    status: 'delivered',
    carrier: 'Delivery Surface',
    trackingNumber: 'DEL-449120391'
  }
];

const ORDER_STORAGE_KEY = 'kavis_global_orders_v2';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return INITIAL_DEMO_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const placeOrder = (orderData: {
    customer: CustomerDetails;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  }): Order => {
    const timestamp = Date.now();
    const orderNumber = `KV-${timestamp.toString().slice(-6)}`;
    const newOrder: Order = {
      id: `ord-${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod.toLowerCase().includes('cod') ? 'pending' : 'paid',
      status: 'placed',
      carrier: 'BlueDart Express',
      trackingNumber: `BD-${timestamp.toString().slice(-8)}IN`
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    carrier?: string,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          return {
            ...order,
            status,
            carrier: carrier || order.carrier,
            trackingNumber: trackingNumber || order.trackingNumber
          };
        }
        return order;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getUserOrders = (email?: string) => {
    if (!email) return [];
    const lower = email.toLowerCase().trim();
    return orders.filter(
      (o) => o.customer.email.toLowerCase().trim() === lower
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const useOrder = useOrders;
