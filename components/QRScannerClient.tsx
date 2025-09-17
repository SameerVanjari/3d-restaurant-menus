'use client';

import React, { useState } from 'react';
import { useZxing } from 'react-zxing';

type Props = {
    onSuccess: (text: string) => void;
    onError?: (text: string) => void;
    validate?: (text: string) => boolean;
};

export default function QrScannerClient({ onSuccess, onError }: Props) {
    const [last, setLast] = useState<string>('');
    const { ref } = useZxing({
        onDecodeResult(result) {
            const text = result.getText();


            setLast(text);            // const isValid = Object.keys(value).includes("restaurantId");
            // console.log("validatin in ", value);
            if (true) {
                onSuccess(text);
            } else {
                onError?.(text);
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
