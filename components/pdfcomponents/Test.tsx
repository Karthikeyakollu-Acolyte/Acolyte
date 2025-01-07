"use client";
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useToolContext } from "@/context/ToolContext";

// Set workerSrc for pdfjs
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Rect } from "fabric/fabric-impl";
import { useSettings } from "@/context/SettingsContext";
pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const PdfViewer = ({ onPagesRendered }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const PdfViewerRef = useRef(null);

    const { selectedTool, brushSize, brushColor, eraserSize } = useToolContext();
    const {setPages} = useSettings()

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }) => {
            setNumPages(numPages); // Update numPages
            setPages(numPages)
        },
        []
    );

    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
    }), []);

    const updatePageRects = useCallback(() => {
        if (!numPages) return; // Early return if numPages is not yet set

        const pdfViewer =document.getElementsByClassName("pdfViewer")[0];
        console.log(pdfViewer)

        if (pdfViewer) {

            const pageRects = [];
            for (let i = 1; i <= numPages; i++) {
                const pageElement = document.querySelector(`[data-page-number="${i}"]`);
                if (pageElement) {
                    const rect = pageElement.getBoundingClientRect();
                    pageRects.push(rect);
                }
            }
            onPagesRendered(pageRects); // Pass the calculated pageRects to the callback
        }
    }, [onPagesRendered, numPages]);

    const handleResize = useCallback(() => {
        updatePageRects();
    }, [updatePageRects]);

    useEffect(() => {
        // Trigger updatePageRects when numPages changes
        if (numPages) {

            updatePageRects();
        }
    }, [numPages, updatePageRects]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            PdfViewerRef.current = null;
            window.removeEventListener("resize", handleResize);
        };
    }, [handleResize]);

    return (
        <div className="relative w-full h-full">
            <div className="relative w-full h-full">
                <Document
                    file={"https://arxiv.org/pdf/1708.08021"}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                    ref={PdfViewerRef}
                    className={"pdfViewer relative"}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="w-[40%]"
                    />
                </Document>
            </div>
        </div>
    );
};

export default PdfViewer;
