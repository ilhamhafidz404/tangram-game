import React from "react";
import { Group, Rect } from "react-konva";

interface TangramPieceProps {
    id: number;
    width: number;
    height: number;
    color: string;
    x: number;
    y: number;
    onDragEnd: (pos: { x: number; y: number }) => void;
}

const TangramPiece: React.FC<TangramPieceProps> = ({
    id,
    width,
    height,
    color,
    x,
    y,
    onDragEnd,
}) => {

    console.log(id)

    return (
        <Group
            x={x}
            y={y}
            draggable
            onDragEnd={(e) => {
                onDragEnd({ x: e.target.x(), y: e.target.y() });
            }}
        >
            <Rect
                width={width}
                height={height}
                fill={color}
                cornerRadius={6}
                stroke="black"
                strokeWidth={1}
                shadowBlur={5}
            />
        </Group>
    );
};

export default TangramPiece;
