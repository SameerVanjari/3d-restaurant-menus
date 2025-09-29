"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import ItemForm from '@/components/forms/item-form';

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    modelUrl?: string;
};

export default function ManageMenuItems() {
    const params = useParams();
    const router = useRouter();
    const menuId = params.menuId as string;
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [isEditItemOpen, setIsEditItemOpen] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [menuId]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/menus/${menuId}/items`);
            if (response.ok) {
                const data = await response.json();
                console.log("data", data)
                setItems(data);
            }
        } catch (error) {
            toast.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Manage Menu Items</h1>
                </div>
                <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                        </DialogHeader>
                        <ItemForm menuId={menuId} onSuccess={() => { setIsAddItemOpen(false); fetchItems(); }} />
                    </DialogContent>
                </Dialog>
                <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        {editItem && (
                            <ItemForm
                                menuId={menuId}
                                item={editItem}
                                onSuccess={() => { setIsEditItemOpen(false); setEditItem(null); fetchItems(); }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
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
                                <span className="text-lg font-bold">₹ {item.price.toFixed(2)}</span>
                                <Button variant="outline" size="sm" onClick={() => { setEditItem(item); setIsEditItemOpen(true); }}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
