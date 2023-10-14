import { useEffect, useRef, MouseEvent } from "react";
import { Bodies, Engine, Render, World, Runner } from "matter-js";
import "./App.css";

function App() {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(Engine.create());
  const isPressed = useRef(false);
  const runner = useRef<Runner | null>(null);

  const handleDown = () => {
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle = (e: MouseEvent) => {
    if (isPressed.current) {
      const ball = Bodies.rectangle(
        e.clientX,
        e.clientY,
        2 * (10 + Math.random() * 30),
        2 * (10 + Math.random() * 30),
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: "#0000ff",
          },
        }
      );
      World.add(engine.current.world, [ball]);
    }
  };

  const handleStart = (e: KeyboardEvent) => {
    console.log("key:", e.key);
    if (e.key == " ") {
      if (runner.current) {
        Runner.stop(runner.current);
        runner.current = null;
      } else {
        runner.current = Runner.run(engine.current);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleStart);
    // mount
    const cw = scene.current!.clientWidth;
    const ch = scene.current!.clientHeight;

    const render = Render.create({
      element: scene.current as HTMLElement,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });

    // boundaries
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    // run the engine
    // Runner.run(engine.current);
    Render.run(render);

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
      ref={scene}
      className="relative flex flex-1"
    ></div>
  );
}

export default App;
