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
  userId?: string;
  userEmail?: string;
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
    userId?: string;
    userEmail?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, carrier?: string, trackingNumber?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (email?: string, userId?: string) => Order[];
}

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-103024',
    orderNumber: 'KV-103024',
    createdAt: '2026-11-05T14:16:00.000Z',
    userId: 'usr-mansoor-01',
    userEmail: 'simplysarath01@gmail.com',
    customer: {
      name: 'Mansoor',
      email: 'simplysarath01@gmail.com',
      phone: '+91 98400 12345',
      address: 'Near Railway Station, Tiruvallur Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600075'
    },
    items: [
      {
        id: 'item-sms-01',
        name: 'Semi Silk Saree',
        image: '/images/products/sarees/saree-2.jpg',
        variant: 'Mustard Yellow with Teal Border',
        quantity: 1,
        unitPrice: 599,
        totalPrice: 599
      }
    ],
    subtotal: 599,
    discount: 0,
    shipping: 99,
    total: 698,
    paymentMethod: 'Prepaid Online (Razorpay 256-Bit SSL)',
    paymentStatus: 'paid',
    status: 'placed',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD-88103024IN'
  },
  {
    id: 'ord-102988',
    orderNumber: 'KV-102988',
    createdAt: '2026-11-05T12:30:00.000Z',
    userId: 'usr-mansoor-01',
    userEmail: 'simplysarath01@gmail.com',
    customer: {
      name: 'Mansoor',
      email: 'simplysarath01@gmail.com',
      phone: '+91 98400 12345',
      address: '12, Trunk Road, Poonamallee',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600075'
    },
    items: [
      {
        id: 'item-cot-01',
        name: 'Cotton Saree',
        image: '/images/products/sarees/saree-1.jpg',
        variant: 'Peach Pink Handloom with Silver Zari',
        quantity: 1,
        unitPrice: 830,
        totalPrice: 830
      }
    ],
    subtotal: 830,
    discount: 0,
    shipping: 99,
    total: 929,
    paymentMethod: 'Prepaid Online (Razorpay 256-Bit SSL)',
    paymentStatus: 'paid',
    status: 'placed',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD-88102988IN'
  },
  {
    id: 'ord-406008',
    orderNumber: 'KV-406008',
    createdAt: '2026-11-04T14:30:00.000Z',
    userId: 'usr-priya-01',
    userEmail: 'priya@kavislifestyle.com',
    customer: {
      name: 'Priyadarshini Sundaram',
      email: 'priyakavislifestyle@gmail.com',
      phone: '+91 98400 12345',
      address: '14B, Alacrity Greens, 4th Main Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040'
    },
    items: [
      {
        id: 'item-101',
        name: 'Kanchipuram Pure Zari Bridal Silk Saree',
        image: '/images/products/sarees/saree-6.jpg',
        variant: 'Bridal Crimson Red',
        quantity: 1,
        unitPrice: 9999,
        totalPrice: 9999
      }
    ],
    subtotal: 9999,
    discount: 1000,
    shipping: 0,
    total: 8999,
    paymentMethod: 'Prepaid Online (Razorpay 256-Bit SSL)',
    paymentStatus: 'paid',
    status: 'placed',
    carrier: 'BlueDart Local Express',
    trackingNumber: 'BD-406008IN'
  },
  {
    id: 'ord-101',
    orderNumber: 'KV-2026-98124',
    createdAt: '2026-02-28T14:30:00Z',
    userId: 'usr-priya-01',
    userEmail: 'priya@kavislifestyle.com',
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
        image: '/images/products/sarees/saree-6.jpg',
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
    status: 'delivered',
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
    status: 'placed',
    carrier: 'Delivery Surface',
    trackingNumber: 'DEL-449120391'
  }
];

const ORDER_STORAGE_KEY = 'kavis_global_orders_v3';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedV3 = localStorage.getItem(ORDER_STORAGE_KEY);
      if (savedV3) {
        const parsed = JSON.parse(savedV3);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure KV-103024 is preserved
          const has103024 = parsed.some((o) => o.orderNumber === 'KV-103024');
          if (!has103024) {
            return [INITIAL_DEMO_ORDERS[0], ...parsed];
          }
          return parsed;
        }
      }
      const savedV2 = localStorage.getItem('kavis_global_orders_v2');
      if (savedV2) {
        const parsed: Order[] = JSON.parse(savedV2);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return INITIAL_DEMO_ORDERS;
  });

  const ordersRef = React.useRef<Order[]>(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Synchronize orders in real-time across devices (Laptop Admin <-> Mobile Client)
  const syncOrdersFromServer = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const serverOrders: Order[] = data.orders;

          // Check if local orders have any order missing on server
          const localList = ordersRef.current || [];
          const missingOnServer = localList.filter((lo) => {
            const key = lo.id || lo.orderNumber;
            return !serverOrders.some((so) => (so.id || so.orderNumber) === key);
          });

          if (missingOnServer.length > 0) {
            // Push local orders to server bulk sync outside setOrders updater
            try {
              fetch('/api/orders/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders: localList })
              }).catch(() => {});
            } catch {}
          }

          // Build merged map: server orders are base, missing local orders appended
          const map = new Map<string, Order>();
          serverOrders.forEach((so) => {
            const key = so.id || so.orderNumber;
            if (key) map.set(key, so);
          });
          localList.forEach((lo) => {
            const key = lo.id || lo.orderNumber;
            if (key && !map.has(key)) {
              map.set(key, lo);
            }
          });

          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setOrders((prev) => {
            if (
              merged.length !== prev.length ||
              merged.some((m, idx) => {
                const p = prev[idx];
                return !p || p.id !== m.id || p.status !== m.status || p.carrier !== m.carrier;
              })
            ) {
              return merged;
            }
            return prev;
          });
        }
      }
    } catch {
      // Offline fallback: seamlessly retains local orders
    }
  };

  useEffect(() => {
    // 1. Initial sync
    syncOrdersFromServer();

    // 2. Poll every 2 seconds so admin status changes immediately appear on mobile phone
    const pollTimer = setInterval(syncOrdersFromServer, 2000);

    // 3. Fast sync whenever user returns to browser tab or comes online
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncOrdersFromServer();
      }
    };
    window.addEventListener('focus', syncOrdersFromServer);
    window.addEventListener('online', syncOrdersFromServer);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('focus', syncOrdersFromServer);
      window.removeEventListener('online', syncOrdersFromServer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const placeOrder = (orderData: {
    customer: CustomerDetails;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
    userId?: string;
    userEmail?: string;
  }): Order => {
    const timestamp = Date.now();
    const orderNumber = `KV-${timestamp.toString().slice(-6)}`;
    const newOrder: Order = {
      id: `ord-${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      userId: orderData.userId,
      userEmail: orderData.userEmail || orderData.customer?.email,
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

    // Push new order to shared cross-device server immediately
    (async () => {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (err) {
        console.error('Failed to post order to server:', err);
      }
    })();

    // Track order ID in session so it always shows up in this browser session
    try {
      const existingSession = JSON.parse(localStorage.getItem('kavis_session_order_ids') || '[]');
      if (!existingSession.includes(newOrder.id)) {
        existingSession.unshift(newOrder.id);
        existingSession.unshift(newOrder.orderNumber);
        localStorage.setItem('kavis_session_order_ids', JSON.stringify(existingSession.slice(0, 50)));
      }
    } catch (e) {
      console.error('Failed to update kavis_session_order_ids', e);
    }

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

    // Push updated status to shared cross-device server so mobile updates in real-time
    (async () => {
      try {
        await fetch('/api/orders/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status, carrier, trackingNumber })
        });
      } catch (err) {
        console.error('Failed to update order status on server:', err);
      }
    })();
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getUserOrders = (email?: string, userId?: string) => {
    const sessionOrderIds: string[] = (() => {
      try {
        return JSON.parse(localStorage.getItem('kavis_session_order_ids') || '[]');
      } catch {
        return [];
      }
    })();

    const cleanEmail = (email || '').toLowerCase().trim();
    const emailPrefix = cleanEmail ? cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') : '';

    return orders
      .filter((o) => {
        // 1. Direct match with orders placed on this device / browser session
        if (sessionOrderIds.includes(o.id) || sessionOrderIds.includes(o.orderNumber)) {
          return true;
        }

        // 2. Direct match with userId
        if (userId && o.userId && o.userId === userId) {
          return true;
        }

        // 3. Direct match with userEmail
        if (cleanEmail && o.userEmail && o.userEmail.toLowerCase().trim() === cleanEmail) {
          return true;
        }

        // 4. Direct match with customer email
        const custEmail = (o.customer?.email || '').toLowerCase().trim();
        if (cleanEmail && custEmail === cleanEmail) {
          return true;
        }

        // 5. Smart match for username prefixes (e.g. 'priya' in 'priya@kavislifestyle.com' vs 'priyakavislifestyle@gmail.com')
        if (emailPrefix && custEmail) {
          const custPrefix = custEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
          if (custPrefix && (custPrefix.includes(emailPrefix) || emailPrefix.includes(custPrefix))) {
            return true;
          }
        }

        return false;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
