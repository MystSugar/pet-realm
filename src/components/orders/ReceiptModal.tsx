"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string;
  orderNumber: string;
}

export default function ReceiptModal({ isOpen, onClose, receiptUrl, orderNumber }: ReceiptModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = `receipt-${orderNumber}.jpg`;
    link.click();
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 bg-cream-50">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Payment Receipt - Order #{orderNumber}</DialogTitle>
        </DialogHeader>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 px-6 pb-3 border-b bg-cream-50 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4 mr-1" />
            Rotate
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>

        {/* Image Viewer */}
        <div className="flex-1 overflow-auto bg-cream-50 p-4">
          <div className="flex items-center justify-center min-h-full">
            <div
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
              className="relative">
              <Image
                src={receiptUrl}
                alt="Payment receipt"
                width={800}
                height={600}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
