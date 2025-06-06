
"use client"; // Add "use client" as we'll use a hook (useCart)

import Image from 'next/image';
import type { MenuItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // Import useCart
import { useToast } from '@/hooks/use-toast'; // Import useToast for feedback

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={item.imageHint || item.category}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-xl font-semibold mb-1">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 flex-grow">{item.description}</CardDescription>
        <p className="text-lg font-bold text-primary mt-auto">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full bg-primary hover:bg-primary/90" onClick={handleAddToCart}> {/* Add onClick handler */}
          <PlusCircle size={18} className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
