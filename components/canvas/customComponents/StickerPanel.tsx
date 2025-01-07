import { useState } from "react";


interface StickerPanelProps {
  stickers: string[];
}

export const StickerPanel = ({ stickers }) => {
  const [uploadedStickers, setUploadedStickers] = useState(stickers);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedStickers((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.includes("image")
      );
      handleFiles(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="fixed right-10 top-24 w-64 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300"
    >
      <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Stickers</h3>
        <label htmlFor="file-upload" className="cursor-pointer">
          <PlusCircleIcon className="w-6 h-6 text-blue-500 hover:text-blue-600" />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <div
        className="p-4 grid grid-cols-3 gap-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {uploadedStickers.map((sticker, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", sticker)}
            className="cursor-pointer hover:scale-105 grid grid-cols-3 transition-transform"
          >
            <img
              src={sticker}
              alt={`sticker-${index}`}
              className="w-12 h-12 object-contain rounded-md shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
