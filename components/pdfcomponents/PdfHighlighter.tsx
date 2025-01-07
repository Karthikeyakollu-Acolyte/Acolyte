"use client"
import React, { useEffect, useRef, useState } from "react";
// import { PdfViewer } from "./PdfViewer";
import type { PDFDocumentProxy } from "pdfjs-dist";
import Toolbar from "../toolbar/Toolbar";
import { CanvasWrapper } from "../canvas/CanvasWrapper"
// import { PDFViewerComponent } from "../Test";
import { PdfViewerComponent } from "./pdfViewerTest";

import PdfViewer from "./Test";
import DragAndDropTool from "../toolbar/ DragAndDropTool";
import { SimpleNote } from "../canvas/customComponents/SimpleNote";
import { useSettings } from "@/context/SettingsContext";
interface PdfHighlighterProps {
    pdfDocument: PDFDocumentProxy;
    pdfScaleValue?: number;
}

export const PdfHighlighter: React.FC<PdfHighlighterProps> = ({
    pdfDocument,
    pdfScaleValue = 1,
}) => {
    const [isDrawing, setIsDrawing] = useState(true);
    const [pageRects, setPageRects] = useState<DOMRect[]>([]);

    const toggleDrawingMode = () => setIsDrawing(!isDrawing);
    const [findController] = useState<any>({});
    const [eventBus] = useState<any>({});
    const divRef = useRef(null);
    const { scale, setScale } = useSettings();
     const containerNodeRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        let localScale = 1; // Local scale variable to track zoom level
        let zoomTimeout; // Timeout for detecting zoom end

        const onWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault(); // Prevent default zoom behavior

                console.log("Zoom event started");

                // Calculate zoom direction
                const delta = e.deltaY > 0 ? -0.1 : 0.1;

                // Restrict scale between 0.9 and 3
                localScale = Math.min(Math.max(localScale + delta, 1), 2);

                // Get mouse position relative to the element
                const rect = div.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;

                // Calculate the transform origin to scale from the mouse position
                const originX = (offsetX / rect.width) * 100;
                const originY = (offsetY / rect.height) * 100;

                div.style.transformOrigin = `${originX}% ${originY}%`;
                div.style.transform = `scale(${localScale})`;

                // Clear any existing timeout to delay "zoom end" action
                clearTimeout(zoomTimeout);

                
                // Set a new timeout to trigger the "zoom end" logic
                zoomTimeout = setTimeout(() => {
                    console.log("Zoom event ended");
                    setScale(localScale); // Update the global state with the final scale
                }, 200); // 200ms delay after the last wheel event
            }
        };

        // Add event listener for the wheel event
        div.addEventListener("wheel", onWheel);

        return () => {
            // Clean up event listener and timeout
            div.removeEventListener("wheel", onWheel);
            clearTimeout(zoomTimeout);
        };
    }, [divRef, setScale]); // Ensure `divRef` and `setScale` are in the dependency array




    return (
        <div className="w-full overflow-auto scrollbar-hide relative " ref={divRef} id="pdf-container">
            {/* <PdfViewer
                pdfDocument={pdfDocument}
                pdfScaleValue={pdfScaleValue}
                onPagesRendered={setPageRects}
            /> */}

            <PdfViewerComponent
                pdfDocument={pdfDocument}
                onPagesRendered={setPageRects}
                pdfScaleValue={pdfScaleValue}
                containerNodeRef={containerNodeRef}
            />


            {/* <PDFViewerComponent pdfDocument={pdfDocument} /> */}
            {/* <PdfViewer onPagesRendered={setPageRects} /> */}

            <CanvasWrapper pageRects={pageRects} isDrawing={isDrawing} containerNodeRef={containerNodeRef} type="pdf" />


            {/* <SimpleNote/> */}




        </div>
    );
};



{/* <PDFViewerComponent pdfDocument={pdfDocument}/> */ }
{/* <PdfViewerComponent
                pdfDocument={pdfDocument}
                onPagesRendered={setPageRects}
            /> */}