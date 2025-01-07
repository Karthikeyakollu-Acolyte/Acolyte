import React, { useEffect } from 'react';
import { fabric } from 'fabric';

type DropCanvasProps = {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
    setIsPopupVisible: any;
    setPopupPosition: any;
};




const DropCanvas: React.FC<DropCanvasProps> = ({ fabricCanvas, setIsPopupVisible, setPopupPosition }) => {

    const addImageToCanvas = (imgUrl: string, x: number, y: number) => {
        const imgElement = new Image();
        imgElement.src = imgUrl;
        imgElement.onload = () => {
            const canvas = fabricCanvas.current;
            if (!canvas) return;

            const fabricImage = new fabric.Image(imgElement, {
                left: x,
                top: y,
                angle: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                selectable: true,
            });

            canvas.add(fabricImage);
            canvas.renderAll();
        };
    };

    useEffect(() => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;
        console.log(canvas)
        console.log(fabricCanvas)

        const handleDrop = (e: fabric.IEvent<DragEvent>) => {
            e.e.preventDefault();
            e.e.stopPropagation();

            const left = e.e.offsetX;
            const top = e.e.offsetY;

            const data = e.e.dataTransfer?.getData('text/plain');
            if (!data) return;

            addImageToCanvas(data, left, top);
        };

        const handleMouseMove = () => {
            console.log('Mouse is moving on canvas');
        };

        canvas.on('drop', handleDrop);
        canvas.on('mouse:move', handleMouseMove);

        return () => {
            canvas.off('drop', handleDrop);
            canvas.off('mouse:move', handleMouseMove);
        };
    }, [fabricCanvas]);

    return null;
};

export default DropCanvas;



