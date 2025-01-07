import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';

const ScratchingEraserCanvas = ({ fabricCanvas, singleStrokeErase }) => {
    const points = useRef([]); // To store points of the current path
    const isScratching = useRef(false); // Track if scratching is happening

    useEffect(() => {
        const canvas = fabricCanvas;

        if (!canvas) return;

        const handleMouseDown = () => {
            isScratching.current = true;
            points.current = []; // Reset points
        };

        const handleMouseUp = () => {
            isScratching.current = false;

            if (singleStrokeErase) {
                // Erase all objects touched by the path
                eraseTouchedObjectsWithFade(canvas, points.current);
            } else if (isScratch(points.current)) {
                // Erase only if it's a valid scratch
                eraseTouchedObjectsWithFade(canvas, points.current);
            }
        };

        const handleMouseMove = (options) => {
            if (!isScratching.current) return;

            const pointer = canvas.getPointer(options.e);
            points.current.push(pointer); // Store the current pointer position
        };

        // Add event listeners
        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:up', handleMouseUp);
        canvas.on('mouse:move', handleMouseMove);

        return () => {
            // Clean up event listeners
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:up', handleMouseUp);
            canvas.off('mouse:move', handleMouseMove);
        };
    }, [fabricCanvas, singleStrokeErase]);

    // Function to check if the path forms a scratch
    const isScratch = (pathPoints) => {
        if (pathPoints.length < 10) return false; // Not enough points to form a scratch

        const boundingBox = {
            xMin: Math.min(...pathPoints.map(p => p.x)),
            xMax: Math.max(...pathPoints.map(p => p.x)),
            yMin: Math.min(...pathPoints.map(p => p.y)),
            yMax: Math.max(...pathPoints.map(p => p.y)),
        };

        const boxArea = (boundingBox.xMax - boundingBox.xMin) * (boundingBox.yMax - boundingBox.yMin);
        const pointDensity = pathPoints.length / boxArea;

        return pointDensity > 0.01; // Adjust this threshold as needed
    };

    // Function to erase objects intersected by the path
    const eraseTouchedObjectsWithFade = (canvas, pathPoints) => {
        canvas.getObjects().forEach(obj => {
            const objectBoundingRect = obj.getBoundingRect(true);

            const isTouched = pathPoints.some(point => (
                point.x >= objectBoundingRect.left &&
                point.x <= objectBoundingRect.left + objectBoundingRect.width &&
                point.y >= objectBoundingRect.top &&
                point.y <= objectBoundingRect.top + objectBoundingRect.height
            ));

            if (isTouched) {
                const fadeOut = () => {
                    const duration = 500;
                    const interval = 30;
                    const steps = duration / interval;
                    const opacityStep = obj.opacity / steps;
                    let currentStep = 0;

                    const fadeInterval = setInterval(() => {
                        if (currentStep >= steps) {
                            clearInterval(fadeInterval);
                            canvas.remove(obj);
                            canvas.requestRenderAll();
                        } else {
                            obj.opacity -= opacityStep;
                            canvas.requestRenderAll();
                            currentStep++;
                        }
                    }, interval);
                };

                fadeOut();
            }
        });
    };

    return <></>;
};

export default ScratchingEraserCanvas;
