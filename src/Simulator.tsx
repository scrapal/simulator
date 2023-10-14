import { useEffect, useRef } from "react";
import { Circle, IExperiment, Rectangle } from "./Store";
import {
  Bodies,
  Body,
  Composite,
  Composites,
  Constraint,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";
import { observer } from "mobx-react";
import React from "react";

type SimulatorProps = {
  experiment: IExperiment;
};

export default observer(function Simulator(props: SimulatorProps) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(Engine.create());
  const isPressed = useRef(false);
  const runner = useRef<Runner | null>(null);
  const { experiment } = props;

  const handleDown = () => {
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle = (e: React.MouseEvent) => {
    console.log("mouse move", e.clientX, e.clientY);
    if (isPressed.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ball = Bodies.circle(x, y, 10 + Math.random() * 30, {
        mass: 10,
        restitution: 0.9,
        friction: 0.005,
        render: {
          fillStyle: "#0000ff",
        },
      });
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
      Bodies.rectangle(cw / 2, -10, cw, 20, {
        isStatic: true,
      }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    experiment.shapes.forEach((shape) => {
      if (shape instanceof Circle) {
        const ball = Bodies.circle(shape.x, shape.y, shape.radius, {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: "#0000ff",
          },
        });
        World.add(engine.current.world, [ball]);
      } else if (shape instanceof Rectangle) {
        const rect = Bodies.rectangle(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          {
            mass: 10,
            restitution: 0.9,
            friction: 0.005,
            render: {
              fillStyle: "#0000ff",
            },
          }
        );
        World.add(engine.current.world, [rect]);
      }
    });

    // add bodies
    var group = Body.nextGroup(true);

    var ropeA = Composites.stack(
      100,
      50,
      8,
      2,
      10,
      10,
      function (x: number, y: number) {
        return Bodies.rectangle(x, y, 50, 20, {
          collisionFilter: { group: group },
        });
      }
    );

    Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 2,
      render: { type: "line" },
    });
    Composite.add(
      ropeA,
      Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: {
          x: ropeA.bodies[0].position.x,
          y: ropeA.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    );

    group = Body.nextGroup(true);

    var ropeB = Composites.stack(
      350,
      50,
      10,
      1,
      10,
      10,
      function (x: number, y: number) {
        return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
      }
    );

    Composites.chain(ropeB, 0.5, 0, -0.5, 0, {
      stiffness: 0.8,
      length: 2,
      render: { type: "line" },
    });
    Composite.add(
      ropeB,
      Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: {
          x: ropeB.bodies[0].position.x,
          y: ropeB.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    );

    group = Body.nextGroup(true);

    var ropeC = Composites.stack(
      600,
      50,
      13,
      1,
      10,
      10,
      function (x: number, y: number) {
        return Bodies.rectangle(x - 20, y, 50, 20, {
          collisionFilter: { group: group },
          chamfer: {
            radius: 5,
          },
        });
      }
    );

    Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
    Composite.add(
      ropeC,
      Constraint.create({
        bodyB: ropeC.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: {
          x: ropeC.bodies[0].position.x,
          y: ropeC.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    );

    Composite.add(engine.current.world, [
      ropeA,
      ropeB,
      ropeC,
      Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true }),
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(engine.current.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 700, y: 600 },
    });

    engine.current.gravity.scale /= 10;
    console.log(engine.current.gravity);
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
      // onMouseMove={handleAddCircle}
      ref={scene}
      className="relative flex flex-1"
    ></div>
  );
});
