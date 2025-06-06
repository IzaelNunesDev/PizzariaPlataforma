
"use client"; 

import Link from 'next/link';
import { Pizza, Search, ShoppingCart, Tag, History, MenuSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext'; 
import { Badge } from '@/components/ui/badge'; 

export default function Header() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Pizza className="h-8 w-8" />
          <h1 className="text-2xl font-bold">SliceSite</h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <MenuSquare size={18} /> Menu
          </Link>
          <Link href="/deals" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Tag size={18} /> Deals
          </Link>
          <Link href="/order-history" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <History size={18} /> Order History
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Input type="search" placeholder="Search menu..." className="pr-10 w-48 lg:w-64" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
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
          {/* Mobile Menu Trigger - Can be implemented later */}
          {/* <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button> */}
        </div>
      </div>
      {/* Mobile navigation links and search bar - can be shown via a drawer */}
      <div className="md:hidden border-t border-border p-3 flex flex-col gap-3">
        <div className="relative w-full sm:hidden">
            <Input type="search" placeholder="Search menu..." className="pr-10 w-full" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <nav className="flex flex-col space-y-2">
            <Link href="/" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 py-1">
                <MenuSquare size={18} /> Menu
            </Link>
            <Link href="/deals" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 py-1">
                <Tag size={18} /> Deals
            </Link>
            <Link href="/order-history" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 py-1">
                <History size={18} /> Order History
            </Link>
        </nav>
      </div>
    </header>
  );
}
