'use client';

import React, { useState } from 'react';
import { useZxing } from 'react-zxing';

type Props = {
    onSuccess: (msg: string, text: string) => void;
    onError?: (text: string) => void;
    validate?: (text: string) => boolean;
};

export default function QrScannerClient({ onSuccess, onError }: Props) {
    const [last, setLast] = useState<string>('');
    const { ref } = useZxing({
        onDecodeResult(result) {
            const text = result.getText();

            setLast(text);
            const isValid = text.includes("hotel=");
            if (isValid) {
                onSuccess("Scanned the QR successfully!", text);
            } else {
                onError?.("QR code not valid. Please use a valid code.");
            }
        },
        onError(error) {
            console.error('QR scanner error:', error);
        },
    });

    return (
        <div className="relative w-full max-w-md">
            <video
                ref={ref as React.RefObject<HTMLVideoElement>}
                className="w-full rounded-lg"
                playsInline
                autoPlay
                muted
            />

            {/* overlay guidelines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 border-4 border-green-500 rounded-lg relative" />
            </div>

            <div className="mt-4 text-center">
                <strong>Last scan:</strong> {last || '—'}
            </div>
        </div>
    );
}
