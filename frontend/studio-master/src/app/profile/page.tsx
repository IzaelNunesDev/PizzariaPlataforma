"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { fetchWrapper } from '../../lib/api';

const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export default function ProfilePage() {
    const { user, logout, isLoading, token } = useAuth();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const form = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    async function onSubmit(data: PasswordChangeFormValues) {
        if (!token) {
            toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
            return;
        }
        setIsUpdating(true);
        try {
            const response = await fetchWrapper(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ old_password: data.oldPassword, new_password: data.newPassword })
            });
            const result = await response.json();

            toast({
                title: "Success",
                description: result.message || "Password updated successfully!",
            });
            form.reset();
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Could not update password.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    }

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

                        <hr className="my-6" />

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center text-primary">Change Password</h3>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="oldPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center"><KeyRound size={16} className="mr-2 text-primary" />Old Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter your old password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center"><KeyRound size={16} className="mr-2 text-primary" />New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter new password (min 8 characters)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmNewPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center"><KeyRound size={16} className="mr-2 text-primary" />Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Confirm your new password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isUpdating}>
                                        {isUpdating ? "Updating..." : "Change Password"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}