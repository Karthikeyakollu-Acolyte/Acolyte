"use client"
import { useSettings } from "@/context/SettingsContext";
import Wrapper from "./Wrapper";

interface ScrollableContentProps {
  isExpanded: boolean;
  id:string;
}

export default function ScrollableContent({ isExpanded,id }: ScrollableContentProps) {
  // A4 size: 210mm x 297mm (width x height)
  // We'll use a scale factor to convert mm to pixels
  const scaleFactor = 3.7795275591; // 1mm = 3.7795275591px
  const a4Width = 850;
  const a4Height = 297 * scaleFactor;
  const {isInfinite} = useSettings()
  

  return (
    <div className={`mt-8  transition-all  duration-300 ease-in-out overflow-hidden  ${
      isInfinite ? 'w-full' : 'w-full '
    }`}>
      <div 
        className="shadow-lg mx-auto overflow-auto scrollbar-hide"
        style={{
          width: isInfinite? '95%' : `${a4Width}px`,
          height: `85vh`,
          maxWidth: '100%',
        }}
      >
        {/* Content goes here */}
        <Wrapper id={id}/>
        
      </div>
    </div>
  );
}

