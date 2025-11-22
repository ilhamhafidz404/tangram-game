import { Stage, Layer, Rect, Line } from "react-konva";
import { useEffect, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";

//
import { Alert, Button, Modal } from "alope-ui";

/* -------------------------
   TANGRAM SHAPE INTERFACE
--------------------------*/
interface Shape {
  id: number;
  type: "triangle" | "square" | "parallelogram";
  x: number;
  y: number;
  rotation: number;
  points?: number[];
  width?: number;
  height?: number;
  color: string;
  targetX: number;
  targetY: number;
  targetRotation: number;
  placed: boolean;
}

/* ============================================
      GHOST LAYOUT — SHAPES DIBUAT RUMAH 🏠
============================================ */
const ghostHouseLayout = [
  { x: 200, y: 160 },
  { x: 300, y: 160 }, //
  { x: 211, y: 160 },
  { x: 281, y: 160 }, //
  { x: 280, y: 200 },
  { x: 230, y: 190 },
  { x: 325, y: 190 },
];

const scalePointsX = (points: number[], scaleX: number) => {
  const scaled: number[] = [];
  for (let i = 0; i < points.length; i += 2) {
    const x = points[i] * scaleX;
    const y = points[i + 1];
    scaled.push(x, y);
  }
  return scaled;
};

export default function GamePage() {
  /* -------------------------
             GAME LOGIC
      --------------------------*/
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: 1,
      type: "triangle",
      x: 350,
      y: 440,
      rotation: 0,
      points: scalePointsX([0, 0, 140, 0, 70, -80], 1.3),
      color: "#faeb21ff",
      targetX: ghostHouseLayout[0].x,
      targetY: ghostHouseLayout[0].y,
      targetRotation: 0,
      placed: false,
    },
    {
      id: 2,
      type: "square",
      x: 100,
      y: 530,
      rotation: -90,
      width: 160,
      height: 100,
      color: "#ff816bff",
      targetX: ghostHouseLayout[2].x,
      targetY: ghostHouseLayout[2].y,
      targetRotation: 0,
      placed: false,
    },
    {
      id: 3,
      type: "square",
      x: 250,
      y: 500,
      rotation: 0,
      width: 35,
      height: 35,
      color: "#2958f3ff",
      targetX: ghostHouseLayout[5].x,
      targetY: ghostHouseLayout[5].y,
      targetRotation: 0,
      placed: false,
    },
    {
      id: 4,
      type: "square",
      x: 250,
      y: 400,
      rotation: 0,
      width: 35,
      height: 35,
      color: "#29f3e2ff",
      targetX: ghostHouseLayout[6].x,
      targetY: ghostHouseLayout[6].y,
      targetRotation: 0,
      placed: false,
    },
    {
      id: 5,
      type: "square",
      x: 450,
      y: 480,
      rotation: 0,
      width: 40,
      height: 60,
      color: "#84ff6bff",
      targetX: ghostHouseLayout[4].x,
      targetY: ghostHouseLayout[4].y,
      targetRotation: 0,
      placed: false,
    },
  ]);

  const SNAP_DISTANCE = 30;
  const SNAP_ROTATION = 25;

  /* -------------------------
             DRAG, DROP & ROTATE
      --------------------------*/
  const handleDragMove = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  const handleRotate = (id: number) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rotation: s.rotation + 90 } : s))
    );
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: number) => {
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        const { x, y } = e.target.position();
        const dx = Math.abs(x - s.targetX);
        const dy = Math.abs(y - s.targetY);
        const drot = Math.abs((s.rotation % 360) - s.targetRotation);

        if (dx < SNAP_DISTANCE && dy < SNAP_DISTANCE && drot < SNAP_ROTATION) {
          e.target.position({ x: s.targetX, y: s.targetY });
          e.target.rotation(s.targetRotation);

          //   if (!s.placed) setScore((sc) => sc + 150);

          return {
            ...s,
            x: s.targetX,
            y: s.targetY,
            rotation: s.targetRotation,
            placed: true,
          };
        }
        return { ...s, placed: false };
      })
    );
  };

  const [isOpen, setIsOpen] = useState(false);

  const completed = shapes.every((s) => s.placed);

  useEffect(() => {
    setIsOpen(true);
  }, [completed]);

  return (
    <section className="bg-[url(/bg.jpg)] bg-cover">
      <div className="bg-[url(/bg.jpg)] flex items-center justify-center fixed inset-0 z-50 lg:hidden">
        <div className="max-w-5xl flex flex-col justify-center items-center">
          <Alert
            type="error"
            title="YAAAAAH🙁"
            description="Kamu harus menggunakan Laptop untuk bermain game ini!"
          />

          <Button to="/" className="mt-5" variantType="secondary">
            Kembali
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center min-h-screen justify-center mx-auto max-w-6xl bg-white">
        <div className="flex items-center gap-3 mb-10">
          <img src="/images/img14.png" className="w-28" />
          <h1 className="text-4xl font-bold">Susun Tangram Rumah</h1>
          <img src="/images/img1.png" className="w-28" />
        </div>

        {completed && (
          <div className="mb-10 w-3xl">
            {/* <Alert
              type="success"
              title="YEAY🎉"
              description="Kamu telah berhasil menyusun tangram rumah!"
            /> */}

            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              title="YEAY🎉"
              size="md"
            >
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  Kamu telah berhasil menyusun tangram rumah!
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variantType="primary"
                    onClick={() => {
                      window.location.href = "/game";
                    }}
                  >
                    Ulangi
                  </Button>
                  <Button to="/" variantType="secondary">
                    Kembali
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        )}

        <div className="flex items-center">
          <div className="flex flex-col gap-5 mr-10">
            <img src="/images/img10.png" className="w-36" />
            <img src="/images/img11.png" className="w-36" />
            <img src="/images/img12.png" className="w-36" />
          </div>

          <Stage
            width={600}
            height={600}
            className="border border-gray-400 bg-gray-100 rounded-lg"
          >
            <Layer>
              {shapes.map((s) =>
                s.type === "square" ? (
                  <Rect
                    key={`ghost-${s.id}`}
                    x={s.targetX}
                    y={s.targetY}
                    width={s.width}
                    height={s.height}
                    fill={s.color}
                    opacity={0.3}
                    rotation={s.targetRotation}
                  />
                ) : (
                  <Line
                    key={`ghost-${s.id}`}
                    x={s.targetX}
                    y={s.targetY}
                    points={s.points!}
                    closed
                    fill={s.color}
                    opacity={0.3}
                    rotation={s.targetRotation}
                  />
                )
              )}

              {shapes.map((s) => {
                const props: any = {
                  x: s.x,
                  y: s.y,
                  rotation: s.rotation,
                  fill: s.color,
                  draggable: !s.placed,
                  shadowBlur: 6,
                  onClick: () => handleRotate(s.id),
                  onDragMove: (e: any) => handleDragMove(e, s.id),
                  onDragEnd: (e: any) => handleDragEnd(e, s.id),
                };

                return s.type === "square" ? (
                  <Rect
                    key={s.id}
                    width={s.width}
                    height={s.height}
                    {...props}
                    shadowEnabled={false}
                  />
                ) : (
                  <Line
                    key={s.id}
                    points={s.points!}
                    closed
                    {...props}
                    shadowEnabled={false}
                  />
                );
              })}
            </Layer>
          </Stage>

          <div className="flex flex-col gap-5 ml-10">
            <img src="/images/img16.png" className="w-36" />
            <img src="/images/img8.png" className="w-36" />
            <img src="/images/img4.png" className="w-36" />
          </div>
        </div>

        <div className="w-md mt-10">
          <Alert
            type="warning"
            title="💡Petunjuk"
            description="Klik shape untuk memutar 90°"
          />
        </div>

        {/*  */}
        <div className="flex gap-3 mt-5">
          <Button
            variantType="secondary"
            onClick={() => {
              let confirmation = confirm(
                "Apakah kamu yakin ingin menginggalkan permainan?"
              );

              if (confirmation) {
                window.location.href = "/";
              }
            }}
          >
            Kembali
          </Button>
        </div>
      </div>
    </section>
  );
}
