"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWrapper } from '../lib/api';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
  id: number;
  menu_item_id: string;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  total_price: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push('/login');
      return;
    }
    if (token) {
      const fetchOrders = async () => {
        try {
          const response = await fetchWrapper(`${API_URL}/orders/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setOrders(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [token, isAuthLoading, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
             <History size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Your Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-10 w-full rounded-md my-2" />
                    <Skeleton className="h-12 w-full rounded-md mb-4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-destructive">{error}</p>
            ) : orders.length === 0 ? (
              <div className="text-center">
                <CardDescription className="text-lg text-muted-foreground mb-4">You haven't placed any orders yet.</CardDescription>
                <Link href="/" passHref>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <ShoppingBag size={20} className="mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {orders.map(order => (
                  <AccordionItem value={`item-${order.id}`} key={order.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full pr-4">
                        <span>Order #{order.id}</span>
                        <span className="text-primary font-bold">${order.total_price.toFixed(2)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {order.items.map(item => (
                          <li key={item.id} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.menu_item_id}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}