"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ItemFormProps {
    menuId: string;
    item?: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        imageUrl?: string;
        modelUrl?: string;
    };
    onSuccess?: () => void;
}

export default function ItemForm({ menuId, item, onSuccess }: ItemFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelUrl, setModelUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setDescription(item.description || "");
            setPrice(item.price.toString());
            setCategory(item.category);
            setImageUrl(item.imageUrl || "");
            setModelUrl(item.modelUrl || "");
        }
    }, [item]);

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            toast.error("Please select a .jpg, .jpeg, .png, or .gif file");
            return;
        }

        setImageFile(file);
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            setImageUrl(publicUrl.publicUrl);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
            setImageFile(null);
        }
    };

    const handleModelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
            toast.error("Please select a .glb or .gltf file");
            return;
        }

        setModelFile(file);
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('3d-models')
                .upload(fileName, file);

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
                .from('3d-models')
                .getPublicUrl(fileName);

            setModelUrl(publicUrl.publicUrl);
            toast.success("3D model uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload 3D model");
            setModelFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price || !category.trim()) return;

        setLoading(true);
        try {
            const url = item ? `/api/menus/${menuId}/items/${item.id}` : `/api/menus/${menuId}/items`;
            const method = item ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    price: parseFloat(price),
                    category,
                    imageUrl: imageUrl || undefined,
                    modelUrl: modelUrl || undefined,
                }),
            });

            if (response.ok) {
                toast.success(item ? "Item updated successfully!" : "Item added successfully!");
                if (!item) {
                    setName("");
                    setDescription("");
                    setPrice("");
                    setCategory("");
                    setImageUrl("");
                    setImageFile(null);
                    setModelFile(null);
                    setModelUrl("");
                }
                onSuccess?.();
            } else {
                toast.error(item ? "Failed to update item" : "Failed to add item");
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
            <div>
                <Label htmlFor="imageFile">Image File (optional)</Label>
                <Input
                    id="imageFile"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleImageFileChange}
                />
                {imageUrl && imageFile && <p className="text-sm text-green-600">Image uploaded: {imageFile.name}</p>}
            </div>
            <div>
                <Label htmlFor="modelFile">3D Model File (optional)</Label>
                <Input
                    id="modelFile"
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelFileChange}
                />
                {modelUrl && <p className="text-sm text-green-600">Model uploaded: {modelFile?.name}</p>}
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? (item ? "Updating..." : "Adding...") : (item ? "Edit Item" : "Add Item")}
            </Button>
        </form>
    );
}
