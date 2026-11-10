import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { CustomizationOption } from '../types';
import { saveVideoToIDB, getVideoFromIDB } from '../utils/videoStorage';

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  variant?: string;
  customization?: CustomizationOption;
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

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  requestedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  reason: string;
  description: string;
  itemIds: string[];
  itemsSummary: string;
  videoUrl: string; // Video preview URL / Base64
  videoName?: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  refundAmount?: number;
  reviewedAt?: string;
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
  returnRequest?: ReturnRequest;
}

export type SupabaseTableStatus = 'connected' | 'table_missing' | 'checking' | 'error';

interface OrderContextType {
  orders: Order[];
  supabaseTableStatus: SupabaseTableStatus;
  refreshDatabaseStatus: () => Promise<void>;
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
  submitReturnRequest: (
    orderId: string,
    returnData: {
      reason: string;
      description: string;
      itemIds: string[];
      itemsSummary: string;
      videoUrl: string;
      videoName?: string;
      imageUrl?: string;
    }
  ) => boolean;
  approveReturnRequest: (orderId: string, refundAmount: number, remarks?: string) => void;
  rejectReturnRequest: (orderId: string, remarks: string) => void;
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
      phone: '+91 90953 16566',
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
      phone: '+91 90953 16566',
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
      phone: '+91 90953 16566',
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
      phone: '+91 90953 16566',
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

  const [supabaseTableStatus, setSupabaseTableStatus] = useState<SupabaseTableStatus>('checking');
  const realtimeChannelRef = React.useRef<any>(null);

  const ordersRef = React.useRef<Order[]>(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Hydrate videoUrls from IndexedDB on startup if saved as lightweight reference
  useEffect(() => {
    orders.forEach((order) => {
      if (order.returnRequest?.videoUrl?.startsWith('idb:')) {
        const idbKey = order.returnRequest.videoUrl.replace('idb:', '');
        getVideoFromIDB(idbKey).then((fullVid) => {
          if (fullVid) {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === order.id && o.returnRequest
                  ? { ...o, returnRequest: { ...o.returnRequest, videoUrl: fullVid } }
                  : o
              )
            );
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      // LocalStorage 5MB quota exceeded by video Base64 - save videos to IndexedDB and save lightweight references to localStorage
      try {
        const lightweight = orders.map((o) => {
          if (o.returnRequest && o.returnRequest.videoUrl && o.returnRequest.videoUrl.length > 50000) {
            saveVideoToIDB(`vid_${o.id}`, o.returnRequest.videoUrl);
            return {
              ...o,
              returnRequest: {
                ...o.returnRequest,
                videoUrl: `idb:vid_${o.id}`
              }
            };
          }
          return o;
        });
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lightweight));
      } catch (innerErr) {
        console.error('Failed to save orders to localStorage even with IDB fallback', innerErr);
      }
    }
  }, [orders]);

  // Map Supabase row format to client Order
  const mapSupabaseToOrder = (row: any): Order => {
    if (row.raw_data && typeof row.raw_data === 'object') {
      return {
        ...row.raw_data,
        id: row.id || row.raw_data.id,
        orderNumber: row.order_number || row.raw_data.orderNumber,
        status: (row.status || row.raw_data.status || 'placed') as OrderStatus,
        carrier: row.carrier || row.raw_data.carrier || 'BlueDart Express',
        trackingNumber: row.tracking_number || row.raw_data.trackingNumber || 'BD-88103024IN',
        updatedAt: row.updated_at || row.raw_data.updatedAt
      };
    }
    return {
      id: row.id,
      orderNumber: row.order_number || `KV-${String(row.id).slice(-6)}`,
      createdAt: row.created_at || new Date().toISOString(),
      userId: row.user_id,
      userEmail: row.user_email || row.guest_email,
      customer: typeof row.customer === 'string' ? JSON.parse(row.customer) : row.customer || row.shipping_address || {},
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
      subtotal: Number(row.subtotal) || 0,
      discount: Number(row.discount || row.discount_amount) || 0,
      shipping: Number(row.shipping || row.shipping_charge) || 0,
      total: Number(row.total || row.total_amount) || 0,
      paymentMethod: row.payment_method || 'Prepaid Online',
      paymentStatus: row.payment_status || 'paid',
      status: (row.status || 'placed') as OrderStatus,
      carrier: row.carrier || 'BlueDart Express',
      trackingNumber: row.tracking_number || 'BD-88103024IN'
    };
  };

  const mapOrderToSupabase = (order: Order) => ({
    id: order.id,
    order_number: order.orderNumber,
    created_at: order.createdAt,
    user_id: order.userId || null,
    user_email: order.userEmail || order.customer?.email || null,
    guest_email: order.customer?.email || null,
    guest_phone: order.customer?.phone || null,
    status: order.status,
    subtotal: order.subtotal,
    discount_amount: order.discount,
    shipping_charge: order.shipping,
    total_amount: order.total,
    shipping_address: order.customer,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    carrier: order.carrier,
    tracking_number: order.trackingNumber,
    raw_data: order
  });

  // Synchronize orders in real-time across devices (Supabase Cloud + Shared Server API)
  const syncOrdersFromServer = async () => {
    try {
      let cloudOrders: Order[] = [];

      // 1. Fetch from Supabase Cloud Database if configured
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('orders').select('*');
          if (error) {
            if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
              setSupabaseTableStatus('table_missing');
            } else {
              setSupabaseTableStatus('error');
            }
          } else if (Array.isArray(data)) {
            setSupabaseTableStatus('connected');
            if (data.length > 0) {
              cloudOrders = data.map(mapSupabaseToOrder);
            }
          }
        } catch (sbErr) {
          setSupabaseTableStatus('table_missing');
        }
      }

      // 2. Fetch from shared /api/orders
      let serverOrders: Order[] = [];
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            serverOrders = data.orders;
          }
        }
      } catch {}

      const localList = ordersRef.current || [];

      // Build merged map prioritizing the most up-to-date order status across cloud, server and local
      const map = new Map<string, Order>();

      // A. Populate from server orders
      serverOrders.forEach((so) => {
        const key = so.id || so.orderNumber;
        if (key) map.set(key, so);
      });

      // B. Populate from cloud orders (overrides with cloud if present)
      cloudOrders.forEach((co) => {
        const key = co.id || co.orderNumber;
        if (key) map.set(key, co);
      });

      // C. Populate missing local orders and preserve returnRequest
      localList.forEach((lo) => {
        const key = lo.id || lo.orderNumber;
        if (key) {
          if (!map.has(key)) {
            map.set(key, lo);
          } else {
            const existing = map.get(key)!;
            // Preserve returnRequest if present locally (prevent older server snapshot from wiping return request)
            const mergedReturn = lo.returnRequest || existing.returnRequest;
            map.set(key, {
              ...existing,
              ...lo,
              status: lo.status !== 'placed' && existing.status === 'placed' ? lo.status : existing.status,
              carrier: existing.carrier || lo.carrier,
              trackingNumber: existing.trackingNumber || lo.trackingNumber,
              returnRequest: mergedReturn
            });
          }
        }
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Check if local orders need to be pushed to server/cloud
      const missingOnServer = localList.filter((lo) => {
        const key = lo.id || lo.orderNumber;
        return !serverOrders.some((so) => (so.id || so.orderNumber) === key);
      });

      if (missingOnServer.length > 0) {
        fetch('/api/orders/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: localList })
        }).catch(() => {});
      }

      setOrders((prev) => {
        if (
          merged.length !== prev.length ||
          merged.some((m, idx) => {
            const p = prev[idx];
            return (
              !p ||
              p.id !== m.id ||
              p.status !== m.status ||
              p.carrier !== m.carrier ||
              p.returnRequest?.status !== m.returnRequest?.status ||
              p.returnRequest?.refundAmount !== m.returnRequest?.refundAmount
            );
          })
        ) {
          return merged;
        }
        return prev;
      });
    } catch {
      // Offline fallback: seamlessly retains local orders
    }
  };

  const refreshDatabaseStatus = async () => {
    setSupabaseTableStatus('checking');
    await syncOrdersFromServer();
  };

  useEffect(() => {
    // 1. Initial sync
    syncOrdersFromServer();

    // 2. Poll every 2 seconds as fallback
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

    // 4. Supabase Realtime Broadcast & Database Sync across Mobile & Laptop
    let channel: any = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase.channel('kavis-global-realtime', {
          config: {
            broadcast: { ack: false, self: false }
          }
        });

        realtimeChannelRef.current = channel;

        channel
          // Live Order Placement broadcast (Zero Database Table Dependency)
          .on('broadcast', { event: 'order_placed' }, ({ payload }: any) => {
            if (payload?.order) {
              const incOrder = payload.order as Order;
              setOrders((prev) => {
                const key = incOrder.id || incOrder.orderNumber;
                const exists = prev.some((o) => o.id === key || o.orderNumber === key);
                if (exists) return prev;
                console.log('[Realtime Push] Received new order via Supabase:', incOrder.orderNumber);
                return [incOrder, ...prev];
              });
            }
          })
          // Live Order Status Update broadcast (Zero Database Table Dependency)
          .on('broadcast', { event: 'order_status_updated' }, ({ payload }: any) => {
            if (payload?.orderId && payload?.status) {
              setOrders((prev) =>
                prev.map((order) => {
                  if (order.id === payload.orderId || order.orderNumber === payload.orderId) {
                    console.log(`[Realtime Push] Updated order ${payload.orderId} -> ${payload.status}`);
                    return {
                      ...order,
                      status: payload.status,
                      carrier: payload.carrier || order.carrier,
                      trackingNumber: payload.trackingNumber || order.trackingNumber,
                      updatedAt: new Date().toISOString()
                    };
                  }
                  return order;
                })
              );
            }
          })
          // Live Return Request Broadcast
          .on('broadcast', { event: 'return_request_submitted' }, ({ payload }: any) => {
            if (payload?.order) {
              const incoming = payload.order as Order;
              setOrders((prev) => {
                const idx = prev.findIndex((o) => o.id === incoming.id || o.orderNumber === incoming.orderNumber);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = { ...next[idx], ...incoming };
                  return next;
                }
                return [incoming, ...prev];
              });
            }
          })
          .on('broadcast', { event: 'return_request_updated' }, ({ payload }: any) => {
            if (payload?.order) {
              const incoming = payload.order as Order;
              setOrders((prev) => {
                const idx = prev.findIndex((o) => o.id === incoming.id || o.orderNumber === incoming.orderNumber);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = { ...next[idx], ...incoming };
                  return next;
                }
                return [incoming, ...prev];
              });
            }
          })
          // Live Peer Sync Request (when phone or laptop opens, ask peers for latest orders)
          .on('broadcast', { event: 'request_sync' }, () => {
            const curOrders = ordersRef.current;
            if (curOrders && curOrders.length > 0 && channel) {
              channel.send({
                type: 'broadcast',
                event: 'respond_sync',
                payload: { orders: curOrders }
              });
            }
          })
          // Live Peer Sync Response (receive orders from already open phone or laptop)
          .on('broadcast', { event: 'respond_sync' }, ({ payload }: any) => {
            if (Array.isArray(payload?.orders) && payload.orders.length > 0) {
              setOrders((prev) => {
                const map = new Map<string, Order>();
                prev.forEach((o) => map.set(o.id || o.orderNumber, o));
                let hasNew = false;
                payload.orders.forEach((o: Order) => {
                  const k = o.id || o.orderNumber;
                  if (k && !map.has(k)) {
                    map.set(k, o);
                    hasNew = true;
                  }
                });
                if (!hasNew) return prev;
                return Array.from(map.values()).sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
              });
            }
          })
          // Postgres Database Changes (fires when table is created)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload: any) => {
              if (payload.new) {
                const updated = mapSupabaseToOrder(payload.new);
                setOrders((prev) => {
                  const key = updated.id || updated.orderNumber;
                  const idx = prev.findIndex((o) => o.id === key || o.orderNumber === key);
                  if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = { ...next[idx], ...updated };
                    return next;
                  }
                  return [updated, ...prev];
                });
              }
              syncOrdersFromServer();
            }
          )
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') {
              // Ask any open peers on laptop/mobile to send recent orders
              channel.send({
                type: 'broadcast',
                event: 'request_sync',
                payload: {}
              });
            }
          });
      } catch (err) {
        console.warn('Realtime channel error:', err);
      }
    }

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('focus', syncOrdersFromServer);
      window.removeEventListener('online', syncOrdersFromServer);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        supabase.removeChannel(channel);
        realtimeChannelRef.current = null;
      }
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

    // 1. Instant Realtime Push to any active device (Mobile <-> Laptop) via Supabase Broadcast
    if (realtimeChannelRef.current) {
      try {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'order_placed',
          payload: { order: newOrder }
        });
      } catch (bcErr) {
        console.warn('Realtime broadcast order_placed notice:', bcErr);
      }
    }

    // 2. Push new order to Supabase Cloud Database immediately
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const { error } = await supabase.from('orders').upsert(mapOrderToSupabase(newOrder));
          if (error) console.warn('Supabase order insert note:', error.message);
        } catch {}
      })();
    }

    // 2. Push new order to shared cross-device server immediately
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

    // 1. Instant Realtime Push to any active device (Mobile <-> Laptop) via Supabase Broadcast
    if (realtimeChannelRef.current) {
      try {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'order_status_updated',
          payload: { orderId, status, carrier, trackingNumber }
        });
      } catch (bcErr) {
        console.warn('Realtime broadcast order_status_updated notice:', bcErr);
      }
    }

    // 2. Push updated status to Supabase Cloud Database immediately
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const { error } = await supabase
            .from('orders')
            .update({
              status,
              ...(carrier ? { carrier } : {}),
              ...(trackingNumber ? { tracking_number: trackingNumber } : {}),
              updated_at: new Date().toISOString()
            })
            .or(`id.eq.${orderId},order_number.eq.${orderId}`);
          if (error) console.warn('Supabase status update note:', error.message);
        } catch {}
      })();
    }

    // 2. Push updated status to shared cross-device server so mobile updates in real-time
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

  const submitReturnRequest = (
    orderId: string,
    returnData: {
      reason: string;
      description: string;
      itemIds: string[];
      itemsSummary: string;
      videoUrl: string;
      videoName?: string;
      imageUrl?: string;
    }
  ): boolean => {
    let targetOrder: Order | null = null;
    const nextOrders = orders.map((order) => {
      if (order.id === orderId || order.orderNumber === orderId) {
        const returnReq: ReturnRequest = {
          id: `ret-${Date.now()}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          requestedAt: new Date().toISOString(),
          customerName: order.customer?.name || 'Valued Customer',
          customerEmail: order.customer?.email || order.userEmail || '',
          customerPhone: order.customer?.phone,
          reason: returnData.reason,
          description: returnData.description,
          itemIds: returnData.itemIds,
          itemsSummary: returnData.itemsSummary,
          videoUrl: returnData.videoUrl,
          videoName: returnData.videoName,
          imageUrl: returnData.imageUrl,
          status: 'pending',
          refundAmount: order.total
        };
        targetOrder = {
          ...order,
          returnRequest: returnReq
        };
        return targetOrder;
      }
      return order;
    });

    if (targetOrder) {
      setOrders(nextOrders);
      const ord: Order = targetOrder;

      // Save video to IndexedDB for permanent local storage
      if (returnData.videoUrl) {
        saveVideoToIDB(`vid_${ord.id}`, returnData.videoUrl);
        saveVideoToIDB(`vid_${ord.orderNumber}`, returnData.videoUrl);
      }

      // 1. Instant Realtime Push to Admin Dashboard & peers
      if (realtimeChannelRef.current) {
        try {
          realtimeChannelRef.current.send({
            type: 'broadcast',
            event: 'return_request_submitted',
            payload: { order: ord }
          });
        } catch (e) {
          console.warn('Realtime return broadcast notice:', e);
        }
      }

      // 2. Push to Supabase Cloud
      if (isSupabaseConfigured) {
        (async () => {
          try {
            await supabase.from('orders').upsert(mapOrderToSupabase(ord));
          } catch {}
        })();
      }

      // 3. Push to Server
      (async () => {
        try {
          await fetch('/api/orders/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: ord.id, returnRequest: ord.returnRequest })
          });
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ord)
          });
        } catch (err) {
          console.error('Failed to post return request to server:', err);
        }
      })();

      return true;
    }
    return false;
  };

  const approveReturnRequest = (orderId: string, refundAmount: number, remarks?: string) => {
    let targetOrder: Order | null = null;
    const nextOrders = orders.map((order) => {
      if ((order.id === orderId || order.orderNumber === orderId) && order.returnRequest) {
        const updatedReturn: ReturnRequest = {
          ...order.returnRequest,
          status: 'approved',
          refundAmount: refundAmount,
          adminRemarks: remarks || 'Return verified and refund approved by Store Administrator.',
          reviewedAt: new Date().toISOString()
        };
        targetOrder = {
          ...order,
          returnRequest: updatedReturn
        };
        return targetOrder;
      }
      return order;
    });

    if (targetOrder) {
      setOrders(nextOrders);
      const ord: Order = targetOrder;

      if (realtimeChannelRef.current) {
        try {
          realtimeChannelRef.current.send({
            type: 'broadcast',
            event: 'return_request_updated',
            payload: { order: ord }
          });
        } catch {}
      }
      if (isSupabaseConfigured) {
        (async () => {
          try {
            await supabase.from('orders').upsert(mapOrderToSupabase(ord));
          } catch {}
        })();
      }
      (async () => {
        try {
          await fetch('/api/orders/return/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: ord.id, refundAmount, remarks })
          });
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ord)
          });
        } catch {}
      })();
    }
  };

  const rejectReturnRequest = (orderId: string, remarks: string) => {
    let targetOrder: Order | null = null;
    const nextOrders = orders.map((order) => {
      if ((order.id === orderId || order.orderNumber === orderId) && order.returnRequest) {
        const updatedReturn: ReturnRequest = {
          ...order.returnRequest,
          status: 'rejected',
          adminRemarks: remarks || 'Return declined after product inspection.',
          reviewedAt: new Date().toISOString()
        };
        targetOrder = {
          ...order,
          returnRequest: updatedReturn
        };
        return targetOrder;
      }
      return order;
    });

    if (targetOrder) {
      setOrders(nextOrders);
      const ord: Order = targetOrder;

      if (realtimeChannelRef.current) {
        try {
          realtimeChannelRef.current.send({
            type: 'broadcast',
            event: 'return_request_updated',
            payload: { order: ord }
          });
        } catch {}
      }
      if (isSupabaseConfigured) {
        (async () => {
          try {
            await supabase.from('orders').upsert(mapOrderToSupabase(ord));
          } catch {}
        })();
      }
      (async () => {
        try {
          await fetch('/api/orders/return/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: ord.id, remarks })
          });
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ord)
          });
        } catch {}
      })();
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getUserOrders = (email?: string, userId?: string) => {
    const cleanEmail = (email || '').toLowerCase().trim();

    // If no user is logged in (guest visitor), check orders placed during this guest browser session
    if (!cleanEmail && !userId) {
      const sessionOrderIds: string[] = (() => {
        try {
          return JSON.parse(localStorage.getItem('kavis_session_order_ids') || '[]');
        } catch {
          return [];
        }
      })();
      return orders
        .filter((o) => sessionOrderIds.includes(o.id) || sessionOrderIds.includes(o.orderNumber))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const emailPrefix = cleanEmail ? cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') : '';

    return orders
      .filter((o) => {
        // 1. Direct match with userId
        if (userId && o.userId && o.userId === userId) {
          return true;
        }

        // 2. Direct match with userEmail
        if (cleanEmail && o.userEmail && o.userEmail.toLowerCase().trim() === cleanEmail) {
          return true;
        }

        // 3. Direct match with customer email
        const custEmail = (o.customer?.email || '').toLowerCase().trim();
        if (cleanEmail && custEmail === cleanEmail) {
          return true;
        }

        // 4. Match for identical username prefix across email domains (e.g. 'priya@kavislifestyle.com' vs 'priya@gmail.com')
        // Explicitly disabled for admin accounts so customer orders NEVER appear in admin personal account
        if (emailPrefix && custEmail && !cleanEmail.includes('admin') && !custEmail.includes('admin')) {
          const custPrefix = custEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
          if (custPrefix && custPrefix === emailPrefix) {
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
        supabaseTableStatus,
        refreshDatabaseStatus,
        placeOrder,
        updateOrderStatus,
        submitReturnRequest,
        approveReturnRequest,
        rejectReturnRequest,
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
