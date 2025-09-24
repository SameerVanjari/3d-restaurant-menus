"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MenuFormProps {
    onSuccess?: () => void;
}

export default function MenuForm({ onSuccess }: MenuFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/menus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                toast.success("Menu created successfully!");
                setTitle("");
                setDescription("");
                onSuccess?.();
                router.refresh();
            } else {
                toast.error("Failed to create menu");
            }
        } catch (error) {
            toast.error("Error creating menu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Menu Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter menu title"
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter menu description"
                    rows={3}
                />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Menu"}
            </Button>
        </form>
    );
}
