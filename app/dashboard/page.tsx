"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

type Menu = {
    id: string;
    title: string;
    description: string;
    qrCodeUrl: string | null;
    createdAt: string;
};

export default function Dashboard() {
    const router = useRouter();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [newMenu, setNewMenu] = useState({ title: '', description: '' });

    // Fetch menus
    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await fetch('/api/menus');
            if (response.ok) {
                const data = await response.json();
                setMenus(data);
            }
        } catch (error) {
            toast.error('Failed to fetch menus');
        }
    };

    const createMenu = async () => {
        try {
            const response = await fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMenu),
            });
            if (response.ok) {
                toast.success('Menu created successfully');
                setNewMenu({ title: '', description: '' });
                setIsCreateMenuOpen(false);
                fetchMenus();
            } else {
                toast.error('Failed to create menu');
            }
        } catch (error) {
            toast.error('Failed to create menu');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Dialog open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Menu
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Menu</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newMenu.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMenu({ ...newMenu, title: e.target.value })}
                                    placeholder="Menu Title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newMenu.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMenu({ ...newMenu, description: e.target.value })}
                                    placeholder="Menu Description"
                                />
                            </div>
                            <Button onClick={createMenu} className="w-full">
                                Create Menu
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.map((menu) => (
                    <Card key={menu.id}>
                        <CardHeader>
                            <CardTitle>{menu.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{menu.description}</p>
                            {menu.qrCodeUrl && (
                                <div className="flex justify-center mb-4">
                                    <QRCode value={menu.qrCodeUrl} size={128} />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <QrCode className="w-4 h-4 mr-2" />
                                    View QR
                                </Button>
                                <Button size="sm" className="flex-1" onClick={() => router.push(`/dashboard/menu/${menu.id}`)}>
                                    Manage Items
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
