import { Stage, Layer, Rect, Line, Text } from "react-konva";
import { useState, useRef, useEffect } from "react";
import type { KonvaEventObject } from "konva/lib/Node";

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
  { x: 120, y: 160 },
  { x: 220, y: 160 },
  { x: 131, y: 160 },
  { x: 281, y: 160 },
  { x: 200, y: 200 },
  { x: 150, y: 190 },
  { x: 245, y: 190 }
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

export default function App() {
  const [screen, setScreen] = useState<"start" | "menu" | "game">("menu");

  /* -------------------------
         GAME LOGIC
  --------------------------*/
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: 1,
      type: "triangle",
      x: 260,
      y: 340,
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
      x: 50,
      y: 430,
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
      x: 200,
      y: 400,
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
      x: 200,
      y: 300,
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
      x: 390,
      y: 350,
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

  const [score, setScore] = useState(0);

  console.log("Score:", score);

  const SNAP_DISTANCE = 30;
  const SNAP_ROTATION = 25;

  /* ----------------------------------------
         AUDIO AUTOPLAY (DITAMBAHKAN)
  ----------------------------------------*/
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // if (screen !== "game") return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setTimeout(() => (audio.muted = false), 500);
        })
        .catch(() => {
          audio.muted = true;
          audio.play();
        });
    }
  }, [screen]);

  /* -------------------------
         DRAG, DROP & ROTATE
  --------------------------*/
  const handleDragMove = (e: KonvaEventObject<DragEvent>, id: number) => {
    const { x, y } = e.target.position();
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s))
    );
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

          if (!s.placed) setScore((sc) => sc + 150);

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

  const completed = shapes.every((s) => s.placed);

  /* ============================================================
                    RENDER SCREEN: START
  ============================================================*/
  // if (screen === "start") {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-700 text-white">
  //       <h1 className="text-4xl font-bold mb-6">🧩 Tangram Game</h1>
  //       <button
  //         onClick={() => setScreen("menu")}
  //         className="px-10 py-3 bg-white text-indigo-600 rounded-lg shadow font-bold hover:bg-gray-100"
  //       >
  //         Start
  //       </button>
  //     </div>
  //   );
  // }

  /* ============================================================
                    RENDER SCREEN: MENU
  ============================================================*/
  if (screen === "menu") {
    return (

      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-700 text-white">

        <h1 className="text-4xl font-bold mb-10">🧩 Tangram Game</h1>

        <h2 className="text-xl font-bold mb-5">Menu</h2>

        {/* AUDIO AUTOPLAY (TIDAK MENGGANGGU KODE LAIN) */}
        <audio ref={audioRef} src="/sounds/bgsong.mp3" loop />

        <button
          onClick={() => setScreen("game")}
          className="px-8 py-3 mb-4 bg-green-500 rounded-lg font-bold hover:bg-green-600"
        >
          Play Game
        </button>

        <button
          onClick={() =>
            alert(
              "🧩 Cara Bermain:\n\n• Seret dan susun semua bentuk ke posisi bayangan.\n• Klik sebuah shape untuk memutarnya 90°.\n• Jika posisi & rotasi benar, shape akan terkunci.\n• Selesaikan semua untuk membentuk rumah!"
            )
          }
          className="px-8 py-3 mb-4 bg-yellow-500 rounded-lg font-bold hover:bg-yellow-600"
        >
          Instruksi
        </button>

        <button
          onClick={() =>
            alert(
              "📘 Pengertian Bentuk:\n\n1. Jajargenjang: Memiliki dua pasang sisi sejajar dan sama panjang.\n2. Persegi: Empat sisi sama panjang & empat sudut 90°.\n3. Segitiga: Bangun datar dengan tiga sisi & tiga sudut."
            )
          }
          className="px-8 py-3 mb-4 bg-blue-500 rounded-lg font-bold hover:bg-blue-600"
        >
          Pengertian Bentuk
        </button>

        <button
          onClick={() => setScreen("start")}
          className="px-8 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600"
        >
          Keluar
        </button>
      </div>
    );
  }

  /* ============================================================
                    RENDER SCREEN: GAME
  ============================================================*/
  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-indigo-600 text-white">
      {/* AUDIO AUTOPLAY (TIDAK MENGGANGGU KODE LAIN) */}
      <audio ref={audioRef} src="/sounds/bgsong.mp3" loop />

      <h1 className="text-2xl font-bold mb-2">🧩 Susun Rumah Tangram</h1>
      <p className="text-sm mb-4 opacity-90">Klik shape untuk memutar 90°</p>

      <div className="flex gap-3">
        <a
          href="/"
          className="mb-3 px-4 py-2 bg-gray-800 rounded hover:bg-gray-900 bg-red-500"
        >
          Reset
        </a>
        <button
          onClick={() => setScreen("menu")}
          className="mb-3 px-4 py-2 bg-gray-800 rounded hover:bg-gray-900"
        >
          ← Kembali ke Menu
        </button>
      </div>

      <Stage width={450} height={450} className="border border-gray-400 bg-gray-100 rounded-lg">
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
              <Rect key={s.id} width={s.width} height={s.height} {...props} shadowEnabled={false} />
            ) : (
              <Line key={s.id} points={s.points!} closed {...props} shadowEnabled={false} />
            );
          })}

          {completed && (
            <Text
              text="🎉 Rumah Selesai!"
              x={130}
              y={200}
              fontSize={26}
              fill="green"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
