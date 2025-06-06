"use client"; 

import { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pizza, Search, ShoppingCart, Tag, History, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext'; 
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge'; 

export default function Header() {
  const { cartItems } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Pizza className="h-8 w-8" />
          <h1 className="text-2xl font-bold">SliceSite</h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">Menu</Link>
          <Link href="/deals" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">Deals</Link>
          {token && (
            <Link href="/order-history" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">Order History</Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Input name="search" type="search" placeholder="Search menu..." className="pr-10 w-48 lg:w-64" />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
          </form>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-primary" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {token ? (
             <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="My Profile">
                <User className="h-6 w-6 text-primary" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline">
                <LogIn size={16} className="mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="md:hidden border-t border-border p-3 flex flex-col gap-3">
        <form onSubmit={handleSearch} className="relative w-full">
            <Input name="search" type="search" placeholder="Search menu..." className="pr-10 w-full" />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
        </form>
      </div>
    </header>
  );
}