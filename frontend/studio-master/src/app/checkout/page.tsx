
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, ShoppingBag, User, Mail, Home, Phone } from 'lucide-react';
import Image from 'next/image';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^(\+\d{1,3}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Invalid phone number format." }),
  // Basic placeholder for payment - not actually processed
  paymentDetails: z.string().optional().default("Cash on Delivery"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      paymentDetails: 'Cash on Delivery',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    // In a real app, this is where you'd process the payment and save the order.
    console.log("Order Submitted:", data);
    console.log("Cart Items:", cartItems);
    console.log("Total:", getCartTotal());

    toast({
      title: "Order Placed!",
      description: "Thank you for your order. We've received it and will process it shortly.",
    });
    clearCart();
    router.push('/order-confirmation');
  };

  if (cartItems.length === 0 && typeof window !== 'undefined') { // Ensure this runs client-side
     // router.push('/'); // Redirect to home if cart is empty
     // For now, let's show a message if cart is empty, as redirecting immediately might be confusing
     return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
                <ShoppingBag size={64} className="text-primary mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-6">Please add items to your cart before proceeding to checkout.</p>
                <Button onClick={() => router.push('/')}>Return to Menu</Button>
            </main>
            <Footer />
        </div>
     );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <CardHeader className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
              <CreditCard size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Checkout</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Please review your order and provide your details to complete the purchase.
            </CardDescription>
          </CardHeader>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <ShoppingBag size={24} className="mr-2" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3 p-3 border-b last:border-b-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                      data-ai-hint={item.imageHint || item.category}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-card-foreground">{item.name} (x{item.quantity})</p>
                      <p className="text-xs text-muted-foreground truncate w-full max-w-xs">{item.description}</p>
                    </div>
                    <p className="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <p className="text-card-foreground">Total:</p>
                    <p className="text-primary">${getCartTotal().toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Shipping & Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><User size={16} className="mr-2 text-primary" />Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Mail size={16} className="mr-2 text-primary" />Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Home size={16} className="mr-2 text-primary" />Shipping Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Pizza Lane, Flavor Town" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Phone size={16} className="mr-2 text-primary" />Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="paymentDetails"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="flex items-center"><CreditCard size={16} className="mr-2 text-primary" />Payment Method</FormLabel>
                            <FormControl>
                                <Input {...field} disabled className="bg-muted/50 cursor-not-allowed" />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">Currently only "Cash on Delivery" is supported. Payment processing coming soon!</p>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
