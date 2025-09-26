import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ menuId: string; itemId: string }> }
) {
    try {
        const { menuId, itemId } = await params;
        const body = await request.json();
        const { name, description, price, category, imageUrl, modelUrl } = body;

        const item = await prisma.menuItem.update({
            where: { id: itemId },
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl,
                modelUrl,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
}
