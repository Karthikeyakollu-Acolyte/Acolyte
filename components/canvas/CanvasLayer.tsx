"use client"
import React from 'react';
import { FabricCanvas } from './FabricCanvas';
import { Layer } from '@/context/CanvasContext';

export const CanvasLayer: React.FC<{
    rect: any;
    layer: Layer;
    layerIndex: number;
    pageIndex: number;
    saveLayerContent: any;
}> = ({ rect, layer, layerIndex, pageIndex, saveLayerContent }) => (
    <div
        className="canvas-wrapper absolute"
        id={`canvas-wrapper-${pageIndex}-${layerIndex}`}
        style={{
            top: rect.top - 200,
            width: rect.width - 5,
            height: rect.height,
            zIndex: 10 + layerIndex,
        }}
    >
        <FabricCanvas
            rect={rect}
            index={layerIndex}
            pageIndex={pageIndex}
            isDrawing={true}
            saveLayerContent={(content) => {
                 saveLayerContent(layerIndex, pageIndex, content)
                //  console.log("Saving the content: ",content)

            }

            }
            initialContent={layer.content[pageIndex] || {}}
        />
    </div>
);
