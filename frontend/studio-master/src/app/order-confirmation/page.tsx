
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, History } from 'lucide-react';
import Image from 'next/image';

export default function OrderConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <Card className="max-w-md w-full shadow-xl">
          <CardHeader>
            <div className="inline-flex items-center justify-center bg-green-500 text-white rounded-full p-4 mb-6 mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <CardTitle className="text-3xl font-extrabold text-primary">Order Confirmed!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Thank you for your purchase. Your pizza is on its way!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Image 
              src="https://placehold.co/400x250.png" 
              alt="Happy pizza delivery" 
              width={400} 
              height={250}
              data-ai-hint="pizza delivery celebration" 
              className="rounded-lg shadow-md mx-auto"
            />
            <p className="text-muted-foreground">
              You will receive an email confirmation shortly with your order details.
              For now, why not explore more of our delicious offerings?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" passHref>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <ShoppingBag size={20} className="mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <Link href="/order-history" passHref>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <History size={20} className="mr-2" />
                  View Order History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
