"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  X,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type RoadmapItem = {
  _id: Id<"roadmapItems">;
  _creationTime: number;
  title: string;
  description: string;
  refs: Array<{
    title: string;
    link: string;
  }>;
  order: number;
};

type FormData = {
  title: string;
  description: string;
  refs: Array<{
    title: string;
    link: string;
  }>;
};

const emptyForm: FormData = {
  title: "",
  description: "",
  refs: [{ title: "", link: "" }],
};

export default function RoadmapClient() {
  const { user } = useUser();
  const items = useQuery(api.roadmap.getItems) ?? [];
  const createItem = useMutation(api.roadmap.createItem);
  const updateItem = useMutation(api.roadmap.updateItem);
  const deleteItem = useMutation(api.roadmap.deleteItem);
  const reorderItem = useMutation(api.roadmap.reorderItem);

  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const isAdmin = user?.publicMetadata?.role === "admin";

  const resetForm = () => {
    setFormData(emptyForm);
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const openEditModal = (item: RoadmapItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      refs:
        item.refs.length > 0
          ? item.refs.map((ref) => ({ ...ref }))
          : [{ title: "", link: "" }],
    });
    setSelectedItem(null);
  };

  const filteredRefs = () =>
    formData.refs.filter((ref) => ref.title.trim() && ref.link.trim());

  const handleAddItem = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    setIsSaving(true);
    try {
      await createItem({
        title: formData.title.trim(),
        description: formData.description.trim(),
        refs: filteredRefs(),
        order: sortedItems.length,
      });
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    setIsSaving(true);
    try {
      await updateItem({
        id: editingItem._id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        refs: filteredRefs(),
      });
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (item: RoadmapItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      return;
    }

    await deleteItem({ id: item._id });
    if (selectedItem?._id === item._id) {
      setSelectedItem(null);
    }
    if (editingItem?._id === item._id) {
      resetForm();
    }
  };

  const handleReorder = async (
    item: RoadmapItem,
    direction: "up" | "down",
  ) => {
    await reorderItem({ id: item._id, direction });
  };

  const addRefField = () => {
    setFormData({
      ...formData,
      refs: [...formData.refs, { title: "", link: "" }],
    });
  };

  const updateRefField = (
    index: number,
    field: "title" | "link",
    value: string,
  ) => {
    const newRefs = [...formData.refs];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setFormData({ ...formData, refs: newRefs });
  };

  const removeRefField = (index: number) => {
    const newRefs = formData.refs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      refs: newRefs.length > 0 ? newRefs : [{ title: "", link: "" }],
    });
  };

  const isFormOpen = isAddingItem || editingItem !== null;

  return (
    <div className="min-h-screen bg-transparent relative z-10 px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className={`mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center ${
            isAdmin ? "sm:justify-between" : "sm:justify-center"
          }`}
        >
          <h1 className="text-center text-2xl font-bold text-white sm:text-left sm:text-4xl">
            Learning Roadmap
          </h1>
          {isAdmin && (
            <button
              onClick={() => {
                setFormData(emptyForm);
                setEditingItem(null);
                setIsAddingItem(true);
              }}
              className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 sm:mx-0 sm:w-auto"
            >
              <Plus size={20} />
              Add Item
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Mobile: left rail | Desktop: center rail */}
          <div className="absolute bottom-0 top-0 left-[11px] w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:left-1/2 md:w-1 md:-translate-x-1/2" />

          <div className="space-y-6 sm:space-y-10 md:space-y-12">
            {sortedItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item._id}
                  className={`relative flex items-start md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card column */}
                  <div
                    className={`min-w-0 flex-1 pl-10 md:w-1/2 md:flex-none md:pl-0 ${
                      isEven ? "md:pr-8 md:pl-0" : "md:pl-8 md:pr-0"
                    }`}
                  >
                    <div className="relative">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="w-full text-left"
                      >
                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-slate-700/50 hover:shadow-blue-500/20 sm:rounded-lg sm:p-6">
                          <h3 className="text-base font-semibold break-words text-white transition-colors sm:text-xl">
                            {item.title}
                          </h3>
                        </div>
                      </button>

                      {isAdmin && (
                        <div className="mt-2 flex flex-wrap gap-1.5 md:absolute md:top-2 md:mt-0 md:gap-1 md:right-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(item, "up")}
                            disabled={index === 0}
                            className="rounded-md border border-slate-600 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:p-1.5"
                            aria-label="Move up"
                            title="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(item, "down")}
                            disabled={index === sortedItems.length - 1}
                            className="rounded-md border border-slate-600 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:p-1.5"
                            aria-label="Move down"
                            title="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded-md border border-slate-600 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:border-blue-500 hover:text-white sm:p-1.5"
                            aria-label="Edit item"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item)}
                            className="rounded-md border border-slate-600 bg-slate-900/80 p-2 text-red-400 transition-colors hover:border-red-500 hover:text-red-300 sm:p-1.5"
                            aria-label="Delete item"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute top-4 left-1.5 z-10 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-slate-900 bg-blue-500 shadow-lg shadow-blue-500/50 md:static md:top-auto md:left-auto md:h-4 md:w-4 md:border-4" />

                  {/* Desktop spacer to balance alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-700 bg-slate-800 shadow-2xl sm:max-h-[85vh] sm:rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-detail-title"
          >
            <div className="sticky top-0 flex shrink-0 items-start justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-4 sm:px-6">
              <h2
                id="roadmap-detail-title"
                className="min-w-0 flex-1 text-lg font-bold break-words text-white sm:text-2xl"
              >
                {selectedItem.title}
              </h2>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedItem)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Edit item"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(selectedItem)}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Delete item"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
              <div className="mb-6">
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-slate-300 uppercase sm:text-sm">
                  Description
                </h3>
                <p className="text-sm leading-relaxed break-words text-slate-300 sm:text-base">
                  {selectedItem.description}
                </p>
              </div>

              {selectedItem.refs.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold tracking-wider text-slate-300 uppercase sm:text-sm">
                    References
                  </h3>
                  <div className="space-y-2">
                    {selectedItem.refs.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 rounded-lg p-2.5 text-sm text-blue-400 transition-colors hover:bg-slate-700 hover:text-blue-300 sm:items-center sm:text-base"
                      >
                        <ExternalLink
                          size={16}
                          className="mt-0.5 shrink-0 sm:mt-0"
                        />
                        <span className="min-w-0 break-words">{ref.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div
            className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-700 bg-slate-800 shadow-2xl sm:max-h-[90vh] sm:rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-form-title"
          >
            <div className="sticky top-0 flex shrink-0 items-start justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-4 sm:px-6">
              <h2
                id="roadmap-form-title"
                className="min-w-0 flex-1 text-lg font-bold text-white sm:text-2xl"
              >
                {editingItem ? "Edit Roadmap Item" : "Add Roadmap Item"}
              </h2>
              <button
                onClick={resetForm}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-base text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none sm:text-sm"
                  placeholder="Item title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-base text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none sm:text-sm"
                  rows={4}
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-300">
                  References
                </label>
                <div className="space-y-3">
                  {formData.refs.map((ref, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                      <input
                        type="text"
                        value={ref.title}
                        onChange={(e) =>
                          updateRefField(idx, "title", e.target.value)
                        }
                        className="w-full min-w-0 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-base text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none sm:flex-1 sm:text-sm"
                        placeholder="Reference title"
                      />
                      <input
                        type="url"
                        value={ref.link}
                        onChange={(e) =>
                          updateRefField(idx, "link", e.target.value)
                        }
                        className="w-full min-w-0 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-base text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none sm:flex-1 sm:text-sm"
                        placeholder="Reference URL"
                      />
                      {formData.refs.length > 1 && (
                        <button
                          onClick={() => removeRefField(idx)}
                          className="flex items-center justify-center rounded-lg bg-red-600 px-3 py-2.5 text-white transition-colors hover:bg-red-700 sm:shrink-0"
                          aria-label="Remove reference"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addRefField}
                  className="mt-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  + Add Reference
                </button>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-700 pt-4 sm:flex-row">
                <button
                  onClick={resetForm}
                  className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 text-white transition-colors hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingItem
                      ? "Save Changes"
                      : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
