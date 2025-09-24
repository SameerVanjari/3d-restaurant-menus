import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ menuId: string }> }
) {
    try {
        const { menuId } = await params;
        const items = await prisma.menuItem.findMany({
            where: { menuId },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ menuId: string }> }
) {
    try {
        const { menuId } = await params;
        const body = await request.json();
        const { name, description, price, category, imageUrl } = body;

        const item = await prisma.menuItem.create({
            data: {
                menuId,
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }
}
