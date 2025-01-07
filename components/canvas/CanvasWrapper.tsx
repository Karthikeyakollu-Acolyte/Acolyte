"use client"
import React, { useState, useCallback, useEffect } from "react";
import { useToolContext } from "@/context/ToolContext";
import { FabricCanvas } from "./FabricCanvas";
import type { CanvasWrapperProps } from "@/types/pdf";
import { useRefs } from "@/context/sharedRefs";
import { Plus, Eye, EyeOff, Trash2, PlusCircleIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Layer, useCanvas } from "@/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "@/context/SettingsContext";
import { getLayersById, syncLayers } from "@/db/pdf/layers";
import { LayerControls } from "./LayerControls";
import { CanvasLayer } from "./CanvasLayer";
import { LayerManagement } from "./LayerManagement";
import ReactDOM from "react-dom";

// Types for the layer structure


export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ pageRects, isDrawing, containerNodeRef, type }) => {
  const { setRect } = useCanvas();
  const { currentDocumentId } = useSettings();

  const [layers, setLayers] = useState<Layer[]>([]);

  // Sync layers to storage
  const syncToStorage = async (layers?: any) => {
    try {
      await syncLayers(currentDocumentId, layers);
      console.log(`Layers synced for document ID: ${currentDocumentId}`);
    } catch (error) {
      console.error('Error syncing layers:', error);
    }
  };

  // Save the layer content for a specific layer and page
  const saveLayerContent = (layerIndex: number, pageIndex: number, content: []) => {
    setLayers((prevLayers) => {
      const updatedLayers = [...prevLayers];
      const updatedContent = [...updatedLayers[layerIndex].content];
      updatedContent[pageIndex] = content; // Update the specific page's content
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        content: updatedContent,
      };
      syncToStorage(updatedLayers);
      return updatedLayers;
    });
  };

  // Update the rect based on the first page rect
  useEffect(() => {
    const rect = pageRects[0];
    if (rect) {
      setRect({ width: rect.width, height: rect.height });
    } else {
      console.log("No page rects found");
      // Optionally set default dimensions if no page rects are found
      setRect({ width: 1000, height: 1000 });
    }
  }, [pageRects]);

  // Render Canvas Layer components
  const renderCanvasLayers = () => {
    if (!pageRects || pageRects.length === 0) {
      if (type === "infinte" && layers) {
        console.log("yes its inifnte")
        return layers.map((layer, layerIndex) =>
          layer.visible && (
            <CanvasLayer
              key={`fallback-${layerIndex}`}
              rect={{ width: 2000, height: 1000, top: 200 }} // Default dimensions for the canvas
              layer={layer}
              layerIndex={layerIndex}
              pageIndex={-1} // Default to a single page
              saveLayerContent={saveLayerContent}
            />
          )
        );
      }
      return null; // Nothing to render if type is not "infinite"
    }

    return pageRects.map((rect, pageIndex) =>
      layers.map((layer, layerIndex) =>
        layer.visible && (
          <CanvasLayer
            key={`${pageIndex}-${layerIndex}`}
            rect={rect}
            layer={layer}
            layerIndex={layerIndex}
            pageIndex={pageIndex}
            saveLayerContent={saveLayerContent}
          />
        )
      )
    );
  };

  return (
    <>
      <LayerManagement pageRects={pageRects} syncToStorage={syncToStorage} layers={layers} setLayers={setLayers} />
      <div className="absolute" id="canvas-wrapper">
        {renderCanvasLayers()}
      </div>
    </>
  );
};







