import React from "react";

export interface PaneDividerProps {
  axis: "horizontal" | "vertical";
  onResize: (delta: number) => void;
}

export function PaneDivider({ axis, onResize }: PaneDividerProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = axis === "horizontal"
        ? moveEvent.clientX - startX
        : moveEvent.clientY - startY;
      onResize(delta);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`pane-divider pane-divider--${axis}`}
      onMouseDown={handleMouseDown}
      role="separator"
    />
  );
}
