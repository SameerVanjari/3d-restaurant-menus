"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function QrScannerComponent() {
  const [result, setResult] = useState("");

  const handleScan = (data: any) => {
    if (data) {
      setResult(data.text);
    }
  };

  const _handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>QR Code Scanner</h1>
      <div style={{ width: "500px" }}>
        <QrReader
          onResult={handleScan}
          // onError={handleError}
          // style={{ width: '100%' }}
          constraints={{ facingMode: "environment" }} // Use the back camera
        />
      </div>
      {result && <p>Scanned result: {result}</p>}
    </div>
  );
}
