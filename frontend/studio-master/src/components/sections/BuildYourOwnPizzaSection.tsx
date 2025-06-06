import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Settings2 } from 'lucide-react'; // Settings2 is more generic for "Customize"
import Image from 'next/image';

export default function BuildYourOwnPizzaSection() {
  return (
    <section className="mb-12">
      <Card className="overflow-hidden shadow-xl bg-gradient-to-r from-primary/80 via-primary to-red-700 text-primary-foreground">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6 md:p-10">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center mb-2">
                <ChefHat size={40} className="mr-3 text-accent" />
                <CardTitle className="text-3xl md:text-4xl font-extrabold">Build Your Own Pizza!</CardTitle>
              </div>
              <CardDescription className="text-lg md:text-xl text-primary-foreground/90">
                Unleash your inner chef and create the pizza of your dreams. Choose your crust, sauce, cheese, and toppings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Link href="/customize-pizza">
                <Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105">
                  <Settings2 size={22} className="mr-2" />
                  Customize Your Pizza
                </Button>
              </Link>
            </CardContent>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto md:min-h-[300px] relative">
            <Image 
              src="https://placehold.co/800x600.png" 
              alt="Pizza ingredients"
              layout="fill"
              objectFit="cover"
              data-ai-hint="pizza ingredients collage"
              className="opacity-80 md:opacity-100"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
