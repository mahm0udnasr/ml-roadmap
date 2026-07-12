"use client";

import { X } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { useState, useEffect } from "react";

const nodeStatuses = {
  planned: "مخطط",
  in_progress: "جاري",
  done: "منجز",
} as const;

const statusColors = {
  planned: "bg-zinc-500/20 text-zinc-200 border-zinc-400/30",
  in_progress: "bg-amber-500/20 text-amber-100 border-amber-400/30",
  done: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
};

interface RoadmapSidePanelProps {
  nodeId: string | null;
  nodeTitle: string;
  nodeStatus: "planned" | "in_progress" | "done";
  nodeContent?: string;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSaveContent: (content: string) => void;
  onUpdateNode?: (
    title: string,
    status: "planned" | "in_progress" | "done",
  ) => void;
  onDeleteNode?: () => void;
}

export function RoadmapSidePanel({
  nodeId,
  nodeTitle,
  nodeStatus,
  nodeContent,
  isOpen,
  isAdmin,
  onClose,
  onSaveContent,
  onUpdateNode,
  onDeleteNode,
}: RoadmapSidePanelProps) {
  const [editTitle, setEditTitle] = useState(nodeTitle);
  const [editStatus, setEditStatus] = useState(nodeStatus);
  const [editContent, setEditContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditTitle(nodeTitle);
      setEditStatus(nodeStatus);
      setEditContent(nodeContent || "");
    }
  }, [isOpen, nodeTitle, nodeStatus, nodeContent]);

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      onSaveContent(editContent);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNode = () => {
    if (onUpdateNode) {
      onUpdateNode(editTitle, editStatus);
    }
  };

  const handleDeleteNode = () => {
    if (
      onDeleteNode &&
      window.confirm("Are you sure you want to delete this node?")
    ) {
      onDeleteNode();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f1118] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-node-dialog-title"
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur">
            <h2
              id="roadmap-node-dialog-title"
              className="text-lg font-semibold text-white truncate"
            >
              {nodeTitle}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-[calc(100vh-120px)] px-6 py-6 space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[editStatus]}`}
              >
                {nodeStatuses[editStatus]}
              </span>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5">
                <h3 className="text-sm font-semibold text-white">
                  Admin Options
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-zinc-500 focus:border-[#8b5cf6]/50 focus:outline-none transition"
                      placeholder="Node title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(
                          e.target.value as "planned" | "in_progress" | "done",
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:border-[#8b5cf6]/50 focus:outline-none transition"
                    >
                      <option value="planned">مخطط</option>
                      <option value="in_progress">جاري</option>
                      <option value="done">منجز</option>
                    </select>
                  </div>
                  <button
                    onClick={handleUpdateNode}
                    className="w-full px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium transition"
                  >
                    Save Title & Status
                  </button>
                </div>
              </div>
            )}

            {/* Content Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Content</h3>
                {isAdmin && (
                  <button
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="px-3 py-1 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-medium disabled:opacity-50 transition"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
              <RichTextEditor
                content={editContent}
                onChange={setEditContent}
                readOnly={!isAdmin}
              />
            </div>

            {/* Delete Button */}
            {isAdmin && (
              <button
                onClick={handleDeleteNode}
                className="w-full px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
              >
                Delete Node
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
