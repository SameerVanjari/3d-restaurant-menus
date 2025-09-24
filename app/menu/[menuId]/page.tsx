"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
};

type CartItem = {
    item: MenuItem;
    quantity: number;
};

export default function MenuPage() {
    const params = useParams();
    const menuId = params.menuId as string;
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenuItems();
    }, [menuId]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`/api/menus/${menuId}/items`);
            if (response.ok) {
                const items = await response.json();
                setMenuItems(items);
            } else {
                toast.error('Failed to fetch menu items');
            }
        } catch (error) {
            toast.error('Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.item.id === item.id);
            if (existing) {
                return prev.map((c) =>
                    c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
        toast.success(`${item.name} added to cart`);
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity === 0) {
            setCart((prev) => prev.filter((c) => c.item.id !== itemId));
        } else {
            setCart((prev) =>
                prev.map((c) =>
                    c.item.id === itemId ? { ...c, quantity } : c
                )
            );
        }
    };

    const total = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Menu</h1>
                <Button variant="outline" className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart ({cart.reduce((sum, c) => sum + c.quantity, 0)})
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <Badge variant="secondary">{item.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={item.imageUrl || "/images/lemon-tart.jpg"}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                <Button onClick={() => addToCart(item)}>
                                    Add to Cart
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                    <div className="container mx-auto">
                        <h2 className="text-xl font-bold mb-2">Your Order</h2>
                        {cart.map((c) => (
                            <div key={c.item.id} className="flex justify-between items-center mb-2">
                                <span>{c.item.name} x{c.quantity}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(c.item.id, c.quantity - 1)}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span>{c.quantity}</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(c.item.id, c.quantity + 1)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <span>${(c.item.price * c.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button className="w-full mt-4">
                            Generate Bill
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
