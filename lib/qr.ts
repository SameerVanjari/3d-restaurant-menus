export const generateQRCodeValue = (menuId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/menu/${menuId}`;
};
