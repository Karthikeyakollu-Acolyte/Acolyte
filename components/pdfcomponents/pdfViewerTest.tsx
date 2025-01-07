"use client"
import React, { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useSettings } from "@/context/SettingsContext";
import type { PDFViewer, EventBus, PDFFindController } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import { useRefs } from "@/context/sharedRefs";
import PdfViewer from "./Test";
import * as pdfjsLib from "pdfjs-dist"
import { updatePdf } from "@/db/pdf/docs";
import ReactDOM from "react-dom";

interface PdfViewerProps {
    pdfDocument: PDFDocumentProxy;
    pdfScaleValue?: number;
    onPagesRendered?: (pageRects: DOMRect[]) => void;
    containerNodeRef:HTMLDivElement;
}

export const PdfViewerComponent: React.FC<PdfViewerProps> = ({
    pdfDocument,
    pdfScaleValue,
    onPagesRendered,
    containerNodeRef
    
}) => {
    // const containerNodeRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<PDFViewer | null>(null);
    const pdfViewerInitialized = useRef(false);
    const searchResultsRef = useRef<any[]>([]);


    const findControllerRef = useRef<PDFFindController | null>(null);


    let eventBus: EventBus | undefined;
    const { setPdfViewerRef } = useRefs();
    const { setPages, scrollMode,scale,currentPage,currentDocumentId } = useSettings();

    const initPDFViewer = async () => {
        const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
        const eventBus = new pdfjs.EventBus();
        const linkService = new pdfjs.PDFLinkService();
    
        findControllerRef.current = new pdfjs.PDFFindController({
            linkService,
            eventBus,
        });
    
        if (!containerNodeRef.current) {
            throw new Error("Container reference is missing!");
        }
    
        if (!viewerRef.current) {
            viewerRef.current = new pdfjs.PDFViewer({
                container: containerNodeRef.current,
                eventBus,
                textLayerMode: 2,
                removePageBorders: false,
                findController: findControllerRef.current,
                linkService,
            });
        }
    
        // Ensure the link service is aware of the PDF viewer
        linkService.setViewer(viewerRef.current);
    
        findControllerRef.current.setDocument(pdfDocument);
        viewerRef.current.setDocument(pdfDocument);
    
        // Add empty canvas layers when the pages are initialized
        // eventBus.on("pagesinit", async () => {
        //     const pagesCount = pdfDocument.numPages;
        //     for (let i = 1; i <= 10; i++) {
        //         addEmptyCanvasLayer(i);
        //     }
        // });

        eventBus.on("pagechanging",(e)=>{
            console.log("pagechanging",e.pageNumber)
            // addEmptyCanvasLayer(e.pageNumber);
        })

        // eventBus.on("pagerendered",(e)=>{
        //     console.log("pagerendered",e.pageNumber)
        //     addEmptyCanvasLayer(e.pageNumber);
        // })
        
    
        eventBus.on("pagesinit", onPagesInit);
        /**
         * Add an empty canvas layer for a specific page number and enable drawing.
         * @param {number} pageNumber
         */
        const addEmptyCanvasLayer = (pageNumber:number) => {
            // Locate the container for the specific page
            const pageDiv = containerNodeRef.current.querySelector(
                `.page[data-page-number="${pageNumber}"]`
            ) as HTMLDivElement;
           
    
            if (!pageDiv) {
                console.error(`Page container for page ${pageNumber} not found.`);
                return;
            }
    
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const pageWidth = pageDiv.clientWidth;
            const pageHeight = pageDiv.clientHeight;
    
            canvas.width = pageWidth;
            canvas.height = pageHeight;
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.zIndex = "2"; // Ensure it overlays on top of the PDF content
            canvas.style.pointerEvents = "auto"; // Allow interaction with the canvas
    
            // Append the canvas to the page container
            pageDiv.style.position = "relative"; // Ensure the parent container has positioning
            // pageDiv.appendChild(canvas);
    
            // Enable drawing on the canvas
            // enableDrawingOnCanvas(canvas);
        };
    
        /**
         * Enable drawing functionality on a canvas.
         * @param {HTMLCanvasElement} canvas
         */
        const enableDrawingOnCanvas = (canvas) => {
            const ctx = canvas.getContext("2d");
            let drawing = false;
    
            const startDrawing = (event) => {
                drawing = true;
                ctx.beginPath();
                ctx.moveTo(event.offsetX, event.offsetY);
            };
    
            const draw = (event) => {
                if (!drawing) return;
                ctx.lineTo(event.offsetX, event.offsetY);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.stroke();
            };
    
            const stopDrawing = () => {
                drawing = false;
                ctx.closePath();
            };
    
            // Add event listeners for drawing
            canvas.addEventListener("mousedown", startDrawing);
            canvas.addEventListener("mousemove", draw);
            canvas.addEventListener("mouseup", stopDrawing);
            canvas.addEventListener("mouseout", stopDrawing);
        };
    };
    


    const adjustScale =async ()=>{
            const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 }); // Scale 1 to get original dimensions
    const containerWidth = viewport.width

        const desiredWidth = 850;

        if (containerWidth !== desiredWidth) {
            const currentScale = viewerRef.current._currentScale || 1;
            const newScale = (currentScale * desiredWidth) / containerWidth;
            // viewerRef.current._currentScale=newScale;
        }
    }


const originX = 1000
const originY = 50
useEffect(() => {
    const pdfViewerContainer = viewerRef.current?.container;
    if (!pdfViewerContainer) return;
  
    // Adjust the scale
    // viewerRef.current.currentScale = scale;
    console.log("Scale value in the PDF:", scale);

    // Adjust the position based on originX and originY
    const newLeft = originX || 0;
    const newTop = originY || 0;

  }, [scale]);
  


    // Function: Handle the `pagesinit` event
    const onPagesInit = () => {
        const pdfViewer = viewerRef.current;
        if (pdfViewer) {
            console.log("Pages initialized!");
            setPdfViewerRef(viewerRef);
            setPages(pdfViewer.pagesCount);

            // Render page rects initially
            updatePageRects();
        }
    };

    // Function: Update page positions
    const updatePageRects = () => {
        const pdfViewer = viewerRef.current;
        if (pdfViewer && onPagesRendered) {
            const pageRects: DOMRect[] = [];
            
            for (let i = 1; i <= 8; i++) {
                const pageElement = document.querySelector(
                    `[data-page-number="${i}"]`
                ) as HTMLElement;

                if (pageElement) {
                    const rect = pageElement.getBoundingClientRect();
                    pageRects.push(rect);
                }
            }
            onPagesRendered(pageRects);
        }
    };

    // Debounce resize handler to avoid excessive reflows
    const handleResize = () => {
        updatePageRects();
    };

    // Initialize the PDF viewer only once, based on the component mounting or pdfDocument changing
    useEffect(() => {
        if (!pdfViewerInitialized.current) {
            initPDFViewer().catch((error) =>
                console.error("PDF Viewer initialization failed", error)
            );
            pdfViewerInitialized.current = true; // Mark as initialized
        }
       
        
        // Add event listener for resize
        // window.addEventListener("resize", handleResize);
        // return () => {
        //     viewerRef.current = null;
        //     window.removeEventListener("resize", handleResize);
        // };
    }, [pdfDocument]); // Only run when pdfDocument changes

    // Update page rects when scroll mode changes
    useEffect(() => {
        // handleResize();
    }, [scrollMode]); // Recalculate on scrollMode change

    useEffect(() => {
        const pdfViewer = viewerRef.current;
        if (pdfViewer && pdfScaleValue) {
            // Set the scale using viewer's API if available
            pdfViewer.currentScale = pdfScaleValue; // Use currentScale to update scale
            console.log("Scale updated to:", pdfScaleValue);
            handleResize()
        }
    }, [pdfScaleValue]); // Trigger whenever scale changes

    useEffect(()=>{
        const pdfViewer = viewerRef.current;
        if (pdfViewer && currentPage) {
            // Set the scale using viewer's API if available
            pdfViewer.currentPageNumber = currentPage;

        }

    },[currentPage])


    useEffect(() => {
        if (!pdfDocument) {
          console.log('No PDF document available. Exiting useEffect.');
          return;
        }
      
        const generateThumbnail = async () => {
          try {
            console.log('Generating thumbnail...');
            
            // Get the first page
            const firstPage = await pdfDocument.getPage(1);
            console.log('Fetched the first page of the PDF.');
      
            // Create a canvas to render the page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            const viewport = firstPage.getViewport({ scale: 0.5 }); // Adjust scale for thumbnail size
      
            console.log('Setting up canvas dimensions.');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
      
            // Render the page onto the canvas
            console.log('Rendering the first page onto the canvas.');
            await firstPage.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;
      
            // Get thumbnail as a Base64 image
            const thumbnail = canvas.toDataURL('image/png');
            console.log('Thumbnail generated successfully.');
      
            // Call the updatePdf function to save the thumbnail
            await updatePdf(currentDocumentId, thumbnail);
            console.log('Thumbnail saved to IndexedDB with document ID:', currentDocumentId);
          } catch (error) {
            console.error('Error generating thumbnail:', error);
          }
        };
      
        generateThumbnail();
      }, [pdfDocument]);
      

    return (

                <div
                    ref={containerNodeRef}
                    className="pdf-container scrollbar-hide absolute overflow-auto"
                    id="pdf-container"
                >
                    <div className="pdfViewer  w-full" id="pdfViewer" />
                </div>

    );
};


// export const PdfViewerComponent: React.FC<PdfViewerProps> = ({
//     pdfDocument,
//     pdfScaleValue,
//     onPagesRendered,
// }) => {
//     const containerNodeRef = useRef<HTMLDivElement>(null);
//     const viewerRef = useRef<PDFViewer | null>(null);
//     const pdfViewerInitialized = useRef(false); // Using ref to track initialization

//     let eventBus: EventBus | undefined;
//     const { setPdfViewerRef } = useRefs();
//     const { setPages, scrollMode,scrollToPage } = useSettings();

//     // Function: Initialize the PDF viewer
//     const initPDFViewer = async () => {
//         const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
//         eventBus = new pdfjs.EventBus();

//         if (!containerNodeRef.current) {
//             throw new Error("Container reference is missing!");
//         }

//         if (!viewerRef.current) {
//             viewerRef.current = new pdfjs.PDFViewer({
//                 // viewerRef.current = new pdfjs.PDFSinglePageViewer({
//                 container: containerNodeRef.current,
//                 eventBus,
//                 textLayerMode: 2,
//                 removePageBorders: false,
//                 annotationMode: 1
//             });
//         }

//         // Set up the event listener for `pagesinit`
//         eventBus.on("pagesinit", onPagesInit);
//         viewerRef.current._currentScale = 1.05
//         // viewerRef.current._currentPageNumber=10
       

//         viewerRef.current.setDocument(pdfDocument);
//     };

//     // Function: Handle the `pagesinit` event
//     const onPagesInit = () => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer) {
//             console.log("Pages initialized!");
//             setPdfViewerRef(viewerRef);
//             setPages(pdfViewer.pagesCount);

//             // Render page rects initially
//             updatePageRects();
//         }
//     };

//     // Function: Update page positions
//     const updatePageRects = () => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer && onPagesRendered) {
//             const pageRects: DOMRect[] = [];
            
//             for (let i = 1; i <= pdfDocument.numPages; i++) {
//                 const pageElement = document.querySelector(
//                     `[data-page-number="${i}"]`
//                 ) as HTMLElement;

//                 if (pageElement) {
//                     const rect = pageElement.getBoundingClientRect();
//                     pageRects.push(rect);
//                 }
//             }
//             onPagesRendered(pageRects);
//         }
//     };

//     // Debounce resize handler to avoid excessive reflows
//     const handleResize = () => {
//         updatePageRects();
//     };

//     // Initialize the PDF viewer only once, based on the component mounting or pdfDocument changing
//     useEffect(() => {
//         if (!pdfViewerInitialized.current) {
//             initPDFViewer().catch((error) =>
//                 console.error("PDF Viewer initialization failed", error)
//             );
//             pdfViewerInitialized.current = true; // Mark as initialized
//         }
       
        
//         // Add event listener for resize
//         // window.addEventListener("resize", handleResize);
//         // return () => {
//         //     viewerRef.current = null;
//         //     window.removeEventListener("resize", handleResize);
//         // };
//     }, [pdfDocument]); // Only run when pdfDocument changes

//     // Update page rects when scroll mode changes
//     useEffect(() => {
//         // handleResize();
//     }, [scrollMode]); // Recalculate on scrollMode change

//     useEffect(() => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer && pdfScaleValue) {
//             // Set the scale using viewer's API if available
//             pdfViewer.currentScale = pdfScaleValue; // Use currentScale to update scale
//             console.log("Scale updated to:", pdfScaleValue);
//             handleResize()

//         }
//     }, [pdfScaleValue]); // Trigger whenever scale changes


//     return (
//         <div className="overflow-auto ">
//             <div
//                 ref={containerNodeRef}
//                 className="pdf-container scrollbar-hide absolute overflow-auto"
//                 id="pdf-container"
//             >
//                 <div className="pdfViewer w-full" id="pdfViewer" />
//             </div>
//         </div>
//     );
// };


