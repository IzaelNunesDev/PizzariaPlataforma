"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, logout, isLoading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) {
            router.push('/login');
        }
    }, [isLoading, token, router]);
    
    if (isLoading || !user) {
        return (
             <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <Card className="max-w-md mx-auto shadow-lg">
                    <CardHeader className="text-center">
                        <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full p-3 mb-4 mx-auto">
                            <User size={32} />
                        </div>
                        <CardTitle className="text-3xl font-bold text-primary">My Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-semibold">{user.email}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 border rounded-md">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-semibold text-green-600">{user.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <Button onClick={logout} variant="destructive" className="w-full">
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}