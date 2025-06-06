
"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Pizza, ShoppingCart, CheckCircle2, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import type { MenuItem } from '@/types';

interface Option {
  name: string;
  price: number;
}

const crustOptions: Option[] = [
  { name: 'Thin Crust', price: 0 },
  { name: 'Hand-Tossed', price: 2 },
  { name: 'Stuffed Crust', price: 4 },
];

const sauceOptions: Option[] = [
  { name: 'Classic Tomato', price: 0 },
  { name: 'Spicy Marinara', price: 1 },
  { name: 'Creamy Garlic', price: 1.5 },
];

const toppingOptions: Option[] = [
  { name: 'Pepperoni', price: 2 },
  { name: 'Mushrooms', price: 1.5 },
  { name: 'Onions', price: 1 },
  { name: 'Bell Peppers', price: 1.5 },
  { name: 'Olives', price: 1.25 },
  { name: 'Sausage', price: 2.5 },
  { name: 'Bacon', price: 2.5 },
  { name: 'Pineapple', price: 1.75 },
  { name: 'Extra Cheese', price: 2.0 },
  { name: 'Jalapenos', price: 1.0 },
];

const BASE_PIZZA_PRICE = 8; // Base price for dough and assembly

export default function CustomizePizzaPage() {
  const [selectedCrust, setSelectedCrust] = useState<Option | null>(crustOptions[0]);
  const [selectedSauce, setSelectedSauce] = useState<Option | null>(sauceOptions[0]);
  const [selectedToppings, setSelectedToppings] = useState<Option[]>([]);

  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleCrustSelect = (crust: Option) => {
    setSelectedCrust(crust);
  };

  const handleSauceSelect = (sauce: Option) => {
    setSelectedSauce(sauce);
  };

  const handleToppingToggle = (topping: Option) => {
    setSelectedToppings((prevToppings) =>
      prevToppings.find(t => t.name === topping.name)
        ? prevToppings.filter((t) => t.name !== topping.name)
        : [...prevToppings, topping]
    );
  };

  const totalPrice = useMemo(() => {
    let price = BASE_PIZZA_PRICE;
    if (selectedCrust) price += selectedCrust.price;
    if (selectedSauce) price += selectedSauce.price;
    selectedToppings.forEach((topping) => (price += topping.price));
    return price;
  }, [selectedCrust, selectedSauce, selectedToppings]);

  const handleAddToCart = () => {
    if (!selectedCrust || !selectedSauce) {
      toast({
        title: "Selection Incomplete",
        description: "Please select a crust and a sauce for your pizza.",
        variant: "destructive",
      });
      return;
    }

    const toppingNames = selectedToppings.map(t => t.name).join(', ');
    const description = `Crust: ${selectedCrust.name}. Sauce: ${selectedSauce.name}.${toppingNames ? ` Toppings: ${toppingNames}.` : ''}`;

    const customPizza: MenuItem = {
      id: `custom-pizza-${Date.now()}`,
      name: 'Your Custom Pizza',
      description: description,
      price: totalPrice,
      imageUrl: 'https://placehold.co/600x400.png', // Generic for custom
      imageHint: 'custom pizza variety',
      category: 'pizza',
    };

    addToCart(customPizza);
    toast({
      title: "Pizza Added!",
      description: "Your custom creation is now in your cart.",
    });

    // Optionally reset selections
    // setSelectedCrust(crustOptions[0]);
    // setSelectedSauce(sauceOptions[0]);
    // setSelectedToppings([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-4 mb-4 mx-auto">
              <Pizza size={40} />
            </div>
            <CardTitle className="text-4xl font-extrabold text-primary">Customize Your Pizza</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Craft your perfect pizza from scratch! Total: <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Crust Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">1. Choose Your Crust</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {crustOptions.map(crust => (
                    <Button 
                      key={crust.name} 
                      variant={selectedCrust?.name === crust.name ? "default" : "outline"} 
                      onClick={() => handleCrustSelect(crust)}
                      className="py-6 text-base flex flex-col items-center justify-center h-auto"
                    >
                      {selectedCrust?.name === crust.name && <CheckCircle2 size={18} className="mb-1 text-accent" />}
                      {crust.name}
                      <span className="text-xs text-muted-foreground mt-1">${(BASE_PIZZA_PRICE + crust.price).toFixed(2)} base</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sauce Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">2. Select Your Sauce</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sauceOptions.map(sauce => (
                    <Button 
                      key={sauce.name} 
                      variant={selectedSauce?.name === sauce.name ? "default" : "outline"} 
                      onClick={() => handleSauceSelect(sauce)}
                      className="py-6 text-base flex flex-col items-center justify-center h-auto"
                    >
                       {selectedSauce?.name === sauce.name && <CheckCircle2 size={18} className="mb-1 text-accent" />}
                      {sauce.name}
                      {sauce.price > 0 && <span className="text-xs text-muted-foreground mt-1">+ ${sauce.price.toFixed(2)}</span>}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Toppings Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">3. Add Your Toppings</h3>
                <p className="text-muted-foreground mb-4">Select as many as you like! Each adds to the price.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {toppingOptions.map(topping => (
                    <Button 
                      key={topping.name} 
                      variant={selectedToppings.find(t => t.name === topping.name) ? "default" : "outline"} 
                      onClick={() => handleToppingToggle(topping)}
                      className="py-3 text-sm h-auto flex flex-col items-center justify-center"
                    >
                      {selectedToppings.find(t => t.name === topping.name) && <CheckCircle2 size={16} className="mb-1 text-accent" />}
                      {topping.name}
                      <span className="text-xs text-muted-foreground mt-1">+ ${topping.price.toFixed(2)}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-border pt-6 text-center">
                <Image 
                  src="https://placehold.co/700x300.png" 
                  alt="Pizza customization visual" 
                  width={700}
                  height={300}
                  data-ai-hint="pizza creation delicious" 
                  className="mb-6 rounded-lg shadow-md mx-auto" 
                />
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-8"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} className="mr-2" /> Add to Cart (${totalPrice.toFixed(2)})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
