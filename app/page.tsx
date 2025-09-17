"use client";
import { Download, QrCode } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../components/ui/button";
import { restaurants } from "../lib/menuData";
import { toast } from "sonner";

// Dynamically import the QrScannerComponent and disable server-side rendering
const _QrScannerComponent = dynamic(() => import("../components/QRScanner"), {
  ssr: false,
});
const QrScannerClient = dynamic(() => import("../components/QRScannerClient"), {
  ssr: false,
});

export default function Home() {
  const [scannerOpen, setScannerOpen] = useState(false)
  const qrRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  function downloadSVG(hotelId: string, hotelName: string) {
    const svg = qrRefs.current[hotelId];
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }
    source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${hotelName.replace(/\s+/g, "_")}_qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const downloadPng = (hotelId: string, hotelName: string) => {
    if (!qrRefs.current) return;

    const svg = qrRefs.current[hotelId];
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg!);

    // Convert SVG to base64
    const svg64 = btoa(unescape(encodeURIComponent(source)));
    const image64 = "data:image/svg+xml;base64," + svg64;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${hotelName.replace(/\s+/g, "_")}_qr.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.src = image64;
  };


  const handleSuccess = (msg: string) => {
    toast.success("success: " + msg)
  }

  const handleError = (err: string) => {
    toast.error(err)
  }

  return (
    <div className="container mx-auto font-sans min-h-screen p-8 gap-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Scan QR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan a QR code to view the menu.
            </DialogDescription>
            <QrScannerClient onSuccess={handleSuccess} onError={handleError} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-8 w-full max-w-2xl">
        {restaurants.map((hotel) => (
          <div
            key={hotel.restaurantId}
            className="relative group border rounded-lg p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {hotel.restaurantName}
                </h2>
                <p className="text-gray-600 text-sm">{hotel.description}</p>
              </div>
            </div>
            {/* Desktop: top-right, Mobile: hidden */}
            <div className="hidden sm:block">
              <Dialog>
                <DialogOverlay />
                <DialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Generate QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>{hotel.restaurantName}</DialogTitle>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="bg-white mt-6"
                      style={{ width: 256, height: 256 }}
                    >
                      <QRCode
                        value={`http://localhost:3000/menu?hotel=${hotel.restaurantId}`}
                        size={256}
                        ref={(el: any) => {
                          qrRefs.current[hotel.restaurantId] = el;
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 mt-4"
                      onClick={() =>
                        downloadPng(hotel.restaurantId, hotel.restaurantName)
                      }
                    >
                      <Download className="w-5 h-5" />
                      Download QR
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Mobile: bottom, Desktop: hidden */}
            <div className="block sm:hidden mt-4">
              <Dialog>
                <DialogOverlay />
                <DialogTrigger asChild>
                  <Button variant={"outline"} className="w-full">
                    Generate QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>{hotel.restaurantName}</DialogTitle>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="bg-white mt-6"
                      style={{ width: 256, height: 256 }}
                    >
                      <QRCode
                        value={JSON.stringify(hotel)}
                        size={256}
                        ref={(el: any) => {
                          qrRefs.current[hotel.restaurantId] = el;
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 mt-4"
                      onClick={() =>
                        downloadSVG(hotel.restaurantId, hotel.restaurantName)
                      }
                    >
                      <Download className="w-5 h-5" />
                      Download QR
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
