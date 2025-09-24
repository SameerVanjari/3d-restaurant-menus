import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { menuId: string } }
) {
    try {
        const menuId = params.menuId;
        const items = await prisma.menuItem.findMany({
            where: { menuId },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { menuId: string } }
) {
    try {
        const menuId = params.menuId;
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
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
    }
}
