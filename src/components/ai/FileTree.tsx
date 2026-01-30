"use client";

import type { FileNode } from "@/lib/ai/workspace";

type Props = {
  tree: FileNode[];
  selectedPath?: string | null;
  onSelect: (path: string) => void;
};

export default function FileTree({ tree, selectedPath, onSelect }: Props) {
  return (
    <div className="space-y-2 text-xs text-slate-600">
      {tree.map((node) => (
        <TreeNode key={node.path} node={node} selectedPath={selectedPath} onSelect={onSelect} depth={0} />
      ))}
    </div>
  );
}

type NodeProps = {
  node: FileNode;
  selectedPath?: string | null;
  onSelect: (path: string) => void;
  depth: number;
};

function TreeNode({ node, selectedPath, onSelect, depth }: NodeProps) {
  const isSelected = selectedPath === node.path;
  return (
    <div>
      <button
        type="button"
        onClick={() => node.type === "file" && onSelect(node.path)}
        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition ${
          isSelected ? "bg-slate-900 text-white" : "hover:bg-slate-100"
        }`}
        style={{ paddingLeft: depth * 12 + 8 }}
      >
        <span className="text-slate-400">{node.type === "dir" ? "DIR" : "FILE"}</span>
        <span>{node.name}</span>
      </button>
      {node.type === "dir" && node.children && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
