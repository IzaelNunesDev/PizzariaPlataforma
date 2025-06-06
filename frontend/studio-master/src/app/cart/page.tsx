
"use client"; 

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, Trash2, Plus, Minus, Pizza } from 'lucide-react';
import { useCart } from '@/context/CartContext'; 
import Image from 'next/image'; 
import Link from 'next/link'; // Import Link

interface CustomPizzaDetails {
  crust?: string;
  sauce?: string;
  toppings?: string[];
}

function parseCustomPizzaDescription(description: string): CustomPizzaDetails {
  const details: CustomPizzaDetails = {};
  
  const crustMatch = description.match(/Crust: (.*?)\./);
  if (crustMatch && crustMatch[1]) details.crust = crustMatch[1];

  const sauceMatch = description.match(/Sauce: (.*?)\./);
  if (sauceMatch && sauceMatch[1]) details.sauce = sauceMatch[1];

  const toppingsMatch = description.match(/Toppings: (.*?)\./);
  if (toppingsMatch && toppingsMatch[1] && toppingsMatch[1].trim() !== '') {
    details.toppings = toppingsMatch[1].split(', ').map(t => t.trim());
  } else {
    details.toppings = [];
  }
  
  return details;
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateItemQuantity, getCartTotal } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
              <ShoppingCart size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Your Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            {cartItems.length === 0 ? (
              <div className="text-center">
                <CardDescription className="text-lg text-muted-foreground mb-6">
                  Your cart is currently empty. Start adding some delicious items from our menu!
                </CardDescription>
                <Image 
                  src="https://placehold.co/500x250.png" 
                  alt="Empty shopping cart" 
                  width={500} 
                  height={250}
                  data-ai-hint="empty cart" 
                  className="mb-8 rounded-lg shadow-md mx-auto" 
                />
                 <Link href="/" passHref>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Browse Menu
                    </Button>
                 </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const isCustomPizza = item.id.startsWith('custom-pizza-');
                  let customDetails: CustomPizzaDetails | null = null;
                  if (isCustomPizza) {
                    customDetails = parseCustomPizzaDescription(item.description);
                  }

                  return (
                    <div key={item.id} className="flex items-start sm:items-center gap-4 p-4 border rounded-lg shadow-sm bg-card flex-col sm:flex-row">
                      <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-md overflow-hidden self-center sm:self-start">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={item.imageHint || item.category}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-card-foreground">{item.name}</h3>
                        {isCustomPizza && customDetails ? (
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {customDetails.crust && <p><strong>Crust:</strong> {customDetails.crust}</p>}
                            {customDetails.sauce && <p><strong>Sauce:</strong> {customDetails.sauce}</p>}
                            {customDetails.toppings && customDetails.toppings.length > 0 && (
                              <p><strong>Toppings:</strong> {customDetails.toppings.join(', ')}</p>
                            )}
                            {!customDetails.crust && !customDetails.sauce && (!customDetails.toppings || customDetails.toppings.length === 0) && (
                                <p>{item.description}</p> 
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground sm:hidden mt-1">Unit Price: ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 self-center sm:self-auto">
                        <Button variant="outline" size="icon" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity" disabled={item.quantity <=1}>
                          <Minus size={16} />
                        </Button>
                        <span className="font-medium w-8 text-center text-card-foreground">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                          <Plus size={16} />
                        </Button>
                      </div>
                      <p className="font-semibold text-lg w-auto sm:w-20 text-right text-primary self-center sm:self-auto">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 self-center sm:self-auto" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  );
                })}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-semibold text-card-foreground">Total:</p>
                    <p className="text-2xl font-bold text-primary">${getCartTotal().toFixed(2)}</p>
                  </div>
                  <Link href="/checkout" passHref>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      <CreditCard size={20} className="mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
