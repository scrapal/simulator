import { createContext, useRef } from "react";

const CanvasContext = createContext<CanvasRenderingContext2D>(
  {} as CanvasRenderingContext2D
);

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext("2d");
  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute left-0 bottom-0 right-0 top-0 border-red-700 border-solid border-2 w-full h-full"
      ></canvas>
      {ctx && <CanvasContext.Provider value={ctx}></CanvasContext.Provider>}
    </>
  );
}
