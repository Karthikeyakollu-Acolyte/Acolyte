"use client"
import React, { useEffect, useState } from 'react'
import { FabricCanvas } from '@/components/canvas/FabricCanvas';
import { useParams } from 'next/navigation';

import {} from ""

import { TransformWrapper, TransformComponent, MiniMap } from "react-zoom-pan-pinch";
import { useSettings } from '@/context/SettingsContext'
import { scaleStateProps } from '@/types/pdf';
import { Lock, Unlock, Expand } from 'lucide-react';

import InfiniteCanvas from '@/components/note/InfiniteCanvas';

const page = () => {
  const { id }: { id: string } = useParams();
  return (
    <div>
      <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">
        <div className="flex flex-col items-center pb-8 h-[calc(100vh-80px)]  scrollbar-hide bg-[#F6F7F9] w-full">
          {/* <InfiniteCanvas id={id}/> */}


          {/* <div className="notebook relative  scrollbar-hide" style={{ width: 900, height: 1000 }}>
            <FabricCanvas
              rect={{ width: 900, height: 1000 }}
              index={-1}
              pageIndex={-1}
              isDrawing={true}
              saveLayerContent={(objectContent) => {
                console.log("Saving object content", objectContent);
                // setInitialContent(objectContent);
                // syncNote(id, objectContent)
              }}
              initialContent={[]}

            />
          </div> */}


        </div>
      </div>

    </div>
  )
}

export default page



// const InfiniteCanvas = ({ id }: { id: string }) => {



//   const [initialContent, setInitialContent] = useState<[]>([]);



//   const handleFetchNote = async () => {


//     try {
//       const note = await getPdfById(id);
//       if (note) {
//         setInitialContent(note);
//       } else {
//         // alert('No PDF found with the given ID.');
//       }
//     } catch (error) {
//       console.error('Error fetching PDF:', error);
//       // alert('Failed to fetch the PDF. Please try again.');
//     }
//   };


//   useEffect(() => {
//     handleFetchNote()
//   }, [id])

//   const [isInfinite, setIsInfinite] = useState(false); // For infinite canvas toggle
//   const [isLocked, setIsLocked] = useState(false); // For lock functionality
//   const { currentPage } = useSettings()
//   const [scaleState, setscaleState] = useState<scaleStateProps>(
//     {
//       positionX: 0,
//       positionY: 0,
//       previousScale: 1,
//       scale: 1,
//     })

//   // Function to toggle canvas size (make it infinite)
//   const toggleInfiniteCanvas = () => {
//     setIsInfinite(prev => !prev);
//   };

//   // Function to toggle lock state of the canvas
//   const toggleLockCanvas = () => {
//     setIsLocked(prev => !prev);
//   };



//   return (
//     <div className="border-2 border-gray-300 mt-8 rounded-lg  relative bg-white overflow-auto scrollbar-hide"
//       style={{ width: 900, height: 1000 }}
//     >
//       <TransformWrapper
//         initialScale={1}
//         initialPositionX={0}
//         initialPositionY={0}
//         maxScale={3}
//         minScale={1}
//         wheel={{
//           step: 3,
//           wheelDisabled: true,
//           touchPadDisabled: false,
//           smoothStep: 0.03,
//           // disabled: isLocked
//         }}
//         panning={{
//           allowMiddleClickPan: false,
//           wheelPanning: true,
//           allowLeftClickPan: false,
//           allowRightClickPan: false,
//           // disabled: !isLocked
//           activationKeys: ["s"]
//         }}
//         // onTransformed={(e) => { console.log(e) }}
//         onPanning={(e) => { console.log(e) }}
//         onWheel={(e) => { console.log(e) }}
//         onPinching={(e) => { console.log(e) }}

//         limitToBounds={true}
//         disablePadding={true}

//         pinch={{
//           step: 5
//         }}

//       // disabled={!isLocked}

//       >
//         {({ }) => (
//           <>

//               <TransformComponent
//               >
//                 <div className="notebook relative overflow-auto scrollbar-hide" style={{ width: 900, height: 1000 }}>
//                   <FabricCanvas
//                     rect={{ width: 900, height: 1000 }}
//                     index={id}
//                     pageIndex={id}
//                     isDrawing={true}
//                     saveLayerContent={(objectContent) => {
//                       console.log("Saving object content", objectContent);
//                       // setInitialContent(objectContent);
//                       // syncNote(id, objectContent)
//                     }}
//                     initialContent={[]}
//                   // scaleState={scaleState}
//                   />
//                 </div>
//               </TransformComponent>



//           </>
//         )}

//       </TransformWrapper>

//       <div className='flex gap-2 flex-col fixed bottom-16 right-8'>
//         {/* Infinite Canvas Button */}
//         <button
//           onClick={toggleInfiniteCanvas}
//           className="p-2 bg-gray-700 text-white rounded-full shadow-lg"
//           title="Toggle Infinite Canvas"
//         >
//           <Expand size={24} />
//         </button>

//         {/* Lock Canvas Button */}
//         <button
//           onClick={toggleLockCanvas}
//           className=" p-2 bg-gray-700 text-white rounded-full shadow-lg"
//           title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
//         >
//           {isLocked ? <Unlock size={24} /> : <Lock size={24} />}
//         </button>
//       </div>

//     </div>
//   );
// };
