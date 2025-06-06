
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderHistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
             <History size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Your Order History</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              This is where your past orders will appear once you're logged in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Order history illustration" 
              data-ai-hint="receipt list" 
              width={600}
              height={300}
              className="mt-6 rounded-lg shadow-md mx-auto" 
            />
            <p className="text-muted-foreground">
              No orders to display at the moment.
              Future updates will include account functionality to save and view your order history.
            </p>
            <Link href="/" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ShoppingBag size={20} className="mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
