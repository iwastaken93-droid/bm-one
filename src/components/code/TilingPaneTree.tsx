import React from "react";
import type { PaneNode, OccupantKind } from "@/types";
import { PaneDivider } from "./PaneDivider";
import { CodePaneHeader } from "./CodePaneHeader";

export interface TilingPaneTreeProps {
  node: PaneNode;
  focusedLeafId: string | null;
  onFocusLeaf: (leafId: string) => void;
  onCloseLeaf: (leafId: string) => void;
  onSplitLeaf: (leafId: string, axis: "horizontal" | "vertical", newOccupant: OccupantKind) => void;
  renderOccupant: (leafId: string, occupant: OccupantKind) => React.ReactNode;
}

export function TilingPaneTree({
  node,
  focusedLeafId,
  onFocusLeaf,
  onCloseLeaf,
  onSplitLeaf,
  renderOccupant
}: TilingPaneTreeProps) {
  if (node.type === "leaf") {
    const isFocused = node.id === focusedLeafId;
    return (
      <section
        className={`code-pane-panel ${isFocused ? "code-pane-panel--focused" : ""}`}
        onClick={() => onFocusLeaf(node.id)}
      >
        <CodePaneHeader
          occupant={node.occupant}
          focused={isFocused}
          onFocus={() => onFocusLeaf(node.id)}
          onClose={() => onCloseLeaf(node.id)}
          onSplitHorizontal={() =>
            onSplitLeaf(node.id, "horizontal", { kind: "terminal", sessionId: crypto.randomUUID() })
          }
          onSplitVertical={() =>
            onSplitLeaf(node.id, "vertical", { kind: "terminal", sessionId: crypto.randomUUID() })
          }
        />
        <div className="code-pane-body">{renderOccupant(node.id, node.occupant)}</div>
      </section>
    );
  }

  return (
    <div
      className={`pane-split pane-split--${node.axis}`}
      style={{
        display: "flex",
        flexDirection: node.axis === "horizontal" ? "row" : "column",
        width: "100%",
        height: "100%"
      }}
    >
      {node.children.map((child, index) => {
        const ratio = node.ratios[index] ?? 1 / node.children.length;
        return (
          <React.Fragment key={child.id}>
            <div style={{ flex: ratio, minWidth: 100, minHeight: 80, display: "flex" }}>
              <TilingPaneTree
                node={child}
                focusedLeafId={focusedLeafId}
                onFocusLeaf={onFocusLeaf}
                onCloseLeaf={onCloseLeaf}
                onSplitLeaf={onSplitLeaf}
                renderOccupant={renderOccupant}
              />
            </div>
            {index < node.children.length - 1 && (
              <PaneDivider
                axis={node.axis}
                onResize={(_delta) => {
                  // In production: updates node.ratios proportionally
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
