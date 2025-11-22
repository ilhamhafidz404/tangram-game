import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import TangramPiece from "./TangramPiece";

const targetArea = { x: 200, y: 200, width: 160, height: 160 };

const TangramBoard: React.FC = () => {
    const [pieces, setPieces] = useState([
        { id: 1, width: 100, height: 100, color: "#FF6B6B", x: 50, y: 50 },
        { id: 2, width: 100, height: 50, color: "#4ECDC4", x: 350, y: 60 },
        { id: 3, width: 50, height: 100, color: "#FFD93D", x: 100, y: 350 },
        { id: 4, width: 50, height: 50, color: "#1A535C", x: 400, y: 300 },
    ]);

    const [score, setScore] = useState(0);

    const handleDragEnd = (id: number, pos: { x: number; y: number }) => {
        setPieces((prev) =>
            prev.map((p) => (p.id === id ? { ...p, x: pos.x, y: pos.y } : p))
        );
    };

    useEffect(() => {
        // cek apakah semua potongan berada di area target (mendekati)
        const allInside = pieces.every(
            (p) =>
                p.x + p.width / 2 > targetArea.x &&
                p.x + p.width / 2 < targetArea.x + targetArea.width &&
                p.y + p.height / 2 > targetArea.y &&
                p.y + p.height / 2 < targetArea.y + targetArea.height
        );

        if (allInside) {
            setScore((s) => s + 1);
            alert("🎉 Bagus! Kamu berhasil menyusun persegi!");
        }
    }, [pieces]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2">Tangram Persegi</h1>
            <p>Score: {score}</p>

            <Stage width={600} height={600}>
                <Layer>
                    {/* Area target */}
                    <Rect
                        x={targetArea.x}
                        y={targetArea.y}
                        width={targetArea.width}
                        height={targetArea.height}
                        stroke="#888"
                        strokeWidth={3}
                        dash={[10, 5]}
                    />

                    {/* Potongan */}
                    {pieces.map((p) => (
                        <TangramPiece
                            key={p.id}
                            id={p.id}
                            width={p.width}
                            height={p.height}
                            color={p.color}
                            x={p.x}
                            y={p.y}
                            onDragEnd={(pos) => handleDragEnd(p.id, pos)}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default TangramBoard;
