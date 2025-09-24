"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
};

export default function ManageMenuItems() {
    const params = useParams();
    const router = useRouter();
    const menuId = params.menuId as string;
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetchItems();
    }, [menuId]);

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/menus/${menuId}/items`);
            if (response.ok) {
                const data = await response.json();

                console.log("data", data)
                setItems(data);
            }
        } catch (error) {
            toast.error('Failed to fetch items');
        }
    };

    const addItem = async () => {
        try {
            const response = await fetch(`/api/menus/${menuId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            if (response.ok) {
                toast.success('Item added successfully');
                setNewItem({ name: '', description: '', price: 0, category: '', imageUrl: '' });
                setIsAddItemOpen(false);
                fetchItems();
            } else {
                toast.error('Failed to add item');
            }
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

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
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newItem.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="Item Name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newItem.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewItem({ ...newItem, description: e.target.value })}
                                    placeholder="Item Description"
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                    placeholder="Price"
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={newItem.category}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, category: e.target.value })}
                                    placeholder="Category"
                                />
                            </div>
                            <div>
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    value={newItem.imageUrl}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                    placeholder="Image URL"
                                />
                            </div>
                            <Button onClick={addItem} className="w-full">
                                Add Item
                            </Button>
                        </div>
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
                                <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                <Button variant="outline" size="sm">
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
