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
    <div className="min-h-screen bg-transparent relative z-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex items-center ${isAdmin ? "justify-between" : "justify-center"} mb-12`}
        >
          <h1 className="text-4xl font-bold text-white">Learning Roadmap</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setFormData(emptyForm);
                setEditingItem(null);
                setIsAddingItem(true);
              }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Item
            </button>
          )}
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {sortedItems.map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Left/Right Content */}
                <div className="w-1/2 px-8">
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full text-left"
                    >
                      <div className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500 rounded-lg p-6 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </button>

                    {isAdmin && (
                      <div
                        className={`absolute top-2 flex gap-1 ${
                          index % 2 === 0 ? "right-2" : "left-2"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleReorder(item, "up")}
                          disabled={index === 0}
                          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-600 text-slate-300 hover:text-white hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move up"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(item, "down")}
                          disabled={index === sortedItems.length - 1}
                          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-600 text-slate-300 hover:text-white hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move down"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-600 text-slate-300 hover:text-white hover:border-blue-500 transition-colors"
                          aria-label="Edit item"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-600 text-red-400 hover:text-red-300 hover:border-red-500 transition-colors"
                          aria-label="Delete item"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Dot */}
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 flex-shrink-0 shadow-lg shadow-blue-500/50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl border border-slate-700">
            <div className="flex items-start justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  {selectedItem.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedItem)}
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="Edit item"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(selectedItem)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Delete item"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {selectedItem.refs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    References
                  </h3>
                  <div className="space-y-2">
                    {selectedItem.refs.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors p-2 rounded hover:bg-slate-700"
                      >
                        <ExternalLink size={16} />
                        <span>{ref.title}</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700">
            <div className="flex items-start justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? "Edit Roadmap Item" : "Add Roadmap Item"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Item title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  References
                </label>
                <div className="space-y-2">
                  {formData.refs.map((ref, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={ref.title}
                        onChange={(e) =>
                          updateRefField(idx, "title", e.target.value)
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        placeholder="Reference title"
                      />
                      <input
                        type="text"
                        value={ref.link}
                        onChange={(e) =>
                          updateRefField(idx, "link", e.target.value)
                        }
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        placeholder="Reference URL"
                      />
                      {formData.refs.length > 1 && (
                        <button
                          onClick={() => removeRefField(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addRefField}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Reference
                </button>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
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
