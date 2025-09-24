import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCodeValue } from '@/lib/qr';

export async function GET() {
    try {
        const menus = await prisma.menu.findMany({
            include: { items: true },
        });
        return NextResponse.json(menus);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description } = body;

        const menu = await prisma.menu.create({
            data: {
                title,
                description,
                qrCodeUrl: generateQRCodeValue(title.toLowerCase().replace(/\s+/g, '-')),
            },
        });

        return NextResponse.json(menu, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
    }
}
