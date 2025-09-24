"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ItemFormProps {
    menuId: string;
    onSuccess?: () => void;
}

export default function ItemForm({ menuId, onSuccess }: ItemFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price || !category.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/menus/${menuId}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    price: parseFloat(price),
                    category,
                    imageUrl: imageUrl || undefined,
                }),
            });

            if (response.ok) {
                toast.success("Item added successfully!");
                setName("");
                setDescription("");
                setPrice("");
                setCategory("");
                setImageUrl("");
                onSuccess?.();
            } else {
                toast.error("Failed to add item");
            }
        } catch (error) {
            toast.error("Error adding item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item name"
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter item description"
                    rows={2}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Main Course"
                        required
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Item"}
            </Button>
        </form>
    );
}
