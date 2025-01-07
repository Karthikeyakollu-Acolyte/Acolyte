"use client";
import { useSettings } from "@/context/SettingsContext";
import React, { useCallback, useEffect, useState } from "react";
import { FabricCanvas } from "../FabricCanvas";
import { useToolContext } from "@/context/ToolContext";

export const SimpleNote = () => {
    const { notes, setNotes } = useSettings();


    useEffect(() => {
        console.log(notes);
    }, [notes]);

    const handleClose = (id: string | number) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, isVisible: false } : note
            )
        );
    };


    const {
        selectedTool,
        setSelectedTool,
        isMenuOpen,
        setIsMenuOpen,
        brushSize,
        setBrushSize,
        brushColor,
        setBrushColor,
        setEraserSize,
        eraserSize
    } = useToolContext()
    const [pageRects, setPageRects] = useState<DOMRect | { width: number; height: number }>({
        width: 300,
        height: 300
    });

    const saveLayerContent = useCallback(
        (layerIndex: number | string, content: Object) => {
            setNotes((prevLayers) => {
                return prevLayers.map((layer) => {
                    // If the current layer's index matches the given layerIndex, update the content
                    if (layer.id === layerIndex) {
                        return {
                            ...layer, // Spread the existing layer properties
                            content: content, // Update the content with the new one
                        };
                    }
                    return layer; // Return the layer as is if the index doesn't match
                });
            });
        },
        []
    );




    return (
        <div>
            {notes
                .filter(note => note.isVisible)  // Filter notes based on isVisible
                .map((note) => (
                    <div
                        key={note.id}
                        className="resizable-popup"
                        style={{
                            // position: "absolute",
                            top: note.position.top,
                            left: note.position.left,
                            backgroundColor: "white",
                            zIndex: 1000,
                        }}
                    >
                        {/* <p>{note.content}</p> */}
                        <FabricCanvas
                            rect={pageRects}
                            brushColor={brushColor}
                            brushSize={brushSize}
                            index={note.id}
                            tool={selectedTool}
                            isDrawing={true}
                            pageIndex={"001"}
                            saveLayerContent={(content) =>
                                saveLayerContent(note.id, content)
                            }
                            // initialContent={note.content}
                            noteContent={note.content}
                        />

                        <button
                            onClick={() => handleClose(note.id)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
        </div>
    );

};
