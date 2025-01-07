"use client"
import { useState } from "react";

const DraggableComponent = () => {
    const [dragged, setDragged] = useState(false);
  
    const handleDragStart = (e) => {
      setDragged(true);
      e.dataTransfer.setData('text/plain', e.currentTarget.id);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Submitted value:', e.target.elements.inputField.value);
    };
    return (
      <div
        id="draggable-item"
        className={`p-4 border-2 border-dashed border-blue-500 rounded-lg shadow-md cursor-move bg-white ${dragged ? 'opacity-50' : 'opacity-100'}`}
        draggable
        onDragStart={handleDragStart}
      >
        Drag me
      </div>
    );
  };
  
  