import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import type { DisplayContentsResponse } from "../beacon-rpc/RpcInterface";
import CircularProgress from "@mui/material/CircularProgress";

export function ScreenTab({ rpc, deviceInfo }: { rpc: any, deviceInfo: any }) {
    const [display, setDisplay] = useState<DisplayContentsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    const fetchDisplay = () => {
        setLoading(true);
        rpc.getDisplayContents().then((res: DisplayContentsResponse) => {
            setDisplay(res);
            setLoading(false);
        });
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        rpc.getDisplayContents().then((res: DisplayContentsResponse) => {
            if (mounted) {
                setDisplay(res);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [rpc]);

    useEffect(() => {
        if (!display || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const { width, height, buffer } = display;
        const bin = atob(buffer);
        const imageData = ctx.createImageData(width, height);
        if (deviceInfo && deviceInfo.HardwareVersion === 3) {
            // GFXcanvas1: row-major, each byte is 8 horizontal pixels, LSB is leftmost
            const bytesPerRow = Math.ceil(width / 8);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const byteIndex = y * bytesPerRow + (x >> 3);
                    const bit = 7 - (x & 7);
                    const byte = bin.charCodeAt(byteIndex);
                    const pixelOn = (byte >> bit) & 1;
                    const color = pixelOn ? 0 : 255;
                    const idx = (y * width + x) * 4;
                    imageData.data[idx + 0] = color;
                    imageData.data[idx + 1] = color;
                    imageData.data[idx + 2] = color;
                    imageData.data[idx + 3] = 255;
                }
            }
        } else {
            // SSD1306: each byte is a vertical column of 8 pixels
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const byteIndex = x + Math.floor(y / 8) * width;
                    const bit = y % 8;
                    const byte = bin.charCodeAt(byteIndex);
                    const pixelOn = (byte >> bit) & 1;
                    const color = pixelOn ? 0 : 255;
                    const idx = (y * width + x) * 4;
                    imageData.data[idx + 0] = color;
                    imageData.data[idx + 1] = color;
                    imageData.data[idx + 2] = color;
                    imageData.data[idx + 3] = 255;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }, [display, deviceInfo]);

    if (loading) return <CircularProgress />;
    if (!display) return <div>No display data</div>;
    return (
        <div style={{ textAlign: "center" }}>
            <Button variant="outlined" size="small" onClick={fetchDisplay} style={{ marginBottom: 8 }}>Refresh</Button>
            <br />
            <canvas ref={canvasRef} width={display.width} height={display.height} style={{ border: "1px solid #ccc", imageRendering: "pixelated", width: "125%", height: "125%" }} />
        </div>
    );
}
