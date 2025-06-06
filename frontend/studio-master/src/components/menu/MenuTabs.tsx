"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuItemCard from './MenuItemCard';
// import { menuItems } from '@/data/menu'; // Removed local import
import type { MenuCategory, MenuItem } from '@/types';
import { Pizza, Drumstick, CupSoda, CakeSlice } from 'lucide-react'; // Using CakeSlice for Desserts

const categoryIcons: Record<MenuCategory, React.ElementType> = {
  pizza: Pizza,
  sides: Drumstick,
  drinks: CupSoda,
  desserts: CakeSlice,
};

const categoryLabels: Record<MenuCategory, string> = {
  pizza: 'Pizza',
  sides: 'Sides',
  drinks: 'Drinks',
  desserts: 'Desserts',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function MenuTabs() {
  const [activeTab, setActiveTab] = useState<MenuCategory>('pizza');
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories: MenuCategory[] = ['pizza', 'sides', 'drinks', 'desserts'];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MenuItem[] = await response.json();
        setAllMenuItems(data);
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch menu items:", e);
        setError(e.message || "Failed to load menu. Please try again later.");
        setAllMenuItems([]); // Clear items on error
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const getItemsForCategory = (category: MenuCategory): MenuItem[] => {
    return allMenuItems.filter(item => item.category === category);
  };

  if (loading) {
    return <p className="text-center py-10">Loading menu...</p>; // Or a spinner component
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  }

  return (
    <Tabs defaultValue="pizza" value={activeTab} onValueChange={(value) => setActiveTab(value as MenuCategory)} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6 bg-transparent p-0">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="py-3 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Icon size={20} className="mr-2 hidden sm:inline-block" />
              {categoryLabels[category]}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          {getItemsForCategory(category).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getItemsForCategory(category).map((item: MenuItem) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No items in this category yet. Check back soon!</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
