import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';

export default function DealsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
              <Tag size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Special Deals & Offers</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground">
              Check back soon for our amazing deals and promotions on your favorite pizzas and more!
            </p>
            <img src="https://placehold.co/600x300.png" alt="Promotional banner" data-ai-hint="sale discount" className="mt-6 rounded-lg shadow-md mx-auto" />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
