"use client";

import { useMemo, useState } from "react";
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
  Tag,
} from "lucide-react";
import {
  PRESET_REFERENCE_BADGES,
  emptyReferenceFormRef,
  getBadgeColorClass,
  getBadgeIcon,
  getBadgeLabel,
  toFormRef,
  toStoredRef,
  type ReferenceBadgeType,
  type ReferenceFormRef,
  type StoredReference,
} from "@/lib/referenceBadges";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import {
  getItemCardBorderClass,
  getTimelineDotClass,
  ProgressControl,
  RoadmapProgressButton,
} from "@/components/ProgressControl";
import { itemProgressKey, type ProgressStatus } from "@/lib/progressStorage";

type RoadmapItem = {
  _id: Id<"roadmapItems">;
  _creationTime: number;
  title: string;
  description: string;
  refs: StoredReference[];
  order: number;
};

type RoadmapLabel = {
  _id: Id<"roadmapLabels">;
  _creationTime: number;
  itemId: Id<"roadmapItems">;
  title: string;
  order: number;
};

type FormData = {
  title: string;
  description: string;
  refs: ReferenceFormRef[];
};

const emptyForm: FormData = {
  title: "",
  description: "",
  refs: [emptyReferenceFormRef()],
};

function ReferenceBadgeDisplay({ badge }: { badge?: string }) {
  const label = getBadgeLabel(badge);
  const Icon = getBadgeIcon(badge);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase sm:text-xs ${getBadgeColorClass(badge)}`}
    >
      <Icon size={12} className="shrink-0" />
      {label}
    </span>
  );
}

function ReferenceBadgePicker({
  badgeType,
  customBadge,
  onBadgeTypeChange,
  onCustomBadgeChange,
}: {
  badgeType: ReferenceBadgeType;
  customBadge: string;
  onBadgeTypeChange: (badgeType: ReferenceBadgeType) => void;
  onCustomBadgeChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {PRESET_REFERENCE_BADGES.map((badge) => {
          const Icon = getBadgeIcon(badge);
          const isSelected = badgeType === badge;

          return (
            <button
              key={badge}
              type="button"
              onClick={() => onBadgeTypeChange(badge)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                isSelected
                  ? getBadgeColorClass(badge)
                  : "border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              <Icon size={12} />
              {badge}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onBadgeTypeChange("Custom")}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
            badgeType === "Custom"
              ? getBadgeColorClass("Custom")
              : "border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-200"
          }`}
        >
          <Tag size={12} />
          Custom
        </button>
      </div>

      {badgeType === "Custom" && (
        <input
          type="text"
          value={customBadge}
          onChange={(e) => onCustomBadgeChange(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter custom badge name"
        />
      )}
    </div>
  );
}

function SubLabel({
  title,
  isAdmin,
  onEdit,
  onDelete,
}: {
  title: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative">
      <div className="rounded-md border border-black bg-[#FFD9A6] px-3 py-1.5 text-left text-xs font-medium text-black sm:text-sm">
        {title}
      </div>
      {isAdmin && (
        <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="rounded bg-slate-800 p-1 text-white shadow hover:bg-slate-700"
            aria-label="Edit label"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded bg-red-600 p-1 text-white shadow hover:bg-red-700"
            aria-label="Delete label"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

function ItemLabels({
  labels,
  isAdmin,
  onAddLabel,
  onEditLabel,
  onDeleteLabel,
}: {
  labels: RoadmapLabel[];
  isAdmin: boolean;
  onAddLabel: () => void;
  onEditLabel: (label: RoadmapLabel) => void;
  onDeleteLabel: (label: RoadmapLabel) => void;
}) {
  if (labels.length === 0 && !isAdmin) return null;

  return (
    <div className="relative mt-3 pl-4">
      {labels.length > 0 && (
        <div
          className="absolute top-2 bottom-2 left-0 w-0 border-l-2 border-dotted border-[#8b5cf6]/50"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <div key={label._id} className="relative pl-3">
            <div
              className="absolute top-1/2 left-0 w-3 -translate-y-1/2 border-t-2 border-dotted border-[#8b5cf6]/50"
              aria-hidden="true"
            />
            <SubLabel
              title={label.title}
              isAdmin={isAdmin}
              onEdit={() => onEditLabel(label)}
              onDelete={() => onDeleteLabel(label)}
            />
          </div>
        ))}
        {isAdmin && (
          <button
            type="button"
            onClick={onAddLabel}
            className="flex items-center gap-1 rounded-md border border-dashed border-blue-400 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-300 transition-colors hover:border-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
          >
            <Plus size={13} />
            Add Label
          </button>
        )}
      </div>
    </div>
  );
}

export default function RoadmapClient() {
  const { user } = useUser();
  const items = useQuery(api.roadmap.getItems) ?? [];
  const labels = useQuery(api.roadmap.getLabels) ?? [];
  const createItem = useMutation(api.roadmap.createItem);
  const updateItem = useMutation(api.roadmap.updateItem);
  const deleteItem = useMutation(api.roadmap.deleteItem);
  const reorderItem = useMutation(api.roadmap.reorderItem);
  const createLabel = useMutation(api.roadmap.createLabel);
  const updateLabel = useMutation(api.roadmap.updateLabel);
  const deleteLabel = useMutation(api.roadmap.deleteLabel);
  const { getStatus, cycleStatus } = useRoadmapProgress();

  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [labelModalItemId, setLabelModalItemId] =
    useState<Id<"roadmapItems"> | null>(null);
  const [editingLabel, setEditingLabel] = useState<RoadmapLabel | null>(null);
  const [labelTitle, setLabelTitle] = useState("");
  const [isSavingLabel, setIsSavingLabel] = useState(false);

  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const isAdmin = user?.publicMetadata?.role === "admin";

  const labelsByItem = useMemo(() => {
    const map = new Map<string, RoadmapLabel[]>();
    for (const label of labels) {
      const existing = map.get(label.itemId) ?? [];
      existing.push(label);
      map.set(label.itemId, existing);
    }
    for (const [, itemLabels] of map) {
      itemLabels.sort((a, b) => a.order - b.order);
    }
    return map;
  }, [labels]);

  const progressStats = useMemo(() => {
    const counts: Record<ProgressStatus, number> = {
      todo: 0,
      "in-progress": 0,
      done: 0,
    };

    for (const item of sortedItems) {
      const status = getStatus(itemProgressKey(item._id));
      counts[status]++;
    }

    return {
      totalCount: sortedItems.length,
      counts,
    };
  }, [sortedItems, getStatus]);

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
          ? item.refs.map((ref) => toFormRef(ref))
          : [emptyReferenceFormRef()],
    });
    setSelectedItem(null);
  };

  const openAddLabelModal = (itemId: Id<"roadmapItems">) => {
    setLabelModalItemId(itemId);
    setEditingLabel(null);
    setLabelTitle("");
  };

  const openEditLabelModal = (label: RoadmapLabel) => {
    setLabelModalItemId(label.itemId);
    setEditingLabel(label);
    setLabelTitle(label.title);
  };

  const closeLabelModal = () => {
    setLabelModalItemId(null);
    setEditingLabel(null);
    setLabelTitle("");
  };

  const filteredRefs = (): StoredReference[] =>
    formData.refs
      .map((ref) => toStoredRef(ref))
      .filter((ref): ref is StoredReference => ref !== null);

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

    const itemLabels = labelsByItem.get(item._id) ?? [];
    for (const label of itemLabels) {
      await deleteLabel({ id: label._id });
    }

    await deleteItem({ id: item._id });
    if (selectedItem?._id === item._id) {
      setSelectedItem(null);
    }
    if (editingItem?._id === item._id) {
      resetForm();
    }
  };

  const handleReorder = async (item: RoadmapItem, direction: "up" | "down") => {
    await reorderItem({ id: item._id, direction });
  };

  const handleSaveLabel = async () => {
    if (!labelTitle.trim()) {
      alert("Please enter a label title");
      return;
    }

    setIsSavingLabel(true);
    try {
      if (editingLabel) {
        await updateLabel({
          id: editingLabel._id,
          title: labelTitle.trim(),
        });
      } else if (labelModalItemId) {
        await createLabel({
          itemId: labelModalItemId,
          title: labelTitle.trim(),
        });
      }
      closeLabelModal();
    } finally {
      setIsSavingLabel(false);
    }
  };

  const handleDeleteLabel = async (label: RoadmapLabel) => {
    if (!window.confirm(`Delete label "${label.title}"?`)) return;
    await deleteLabel({ id: label._id });
    if (editingLabel?._id === label._id) {
      closeLabelModal();
    }
  };

  const addRefField = () => {
    setFormData({
      ...formData,
      refs: [...formData.refs, emptyReferenceFormRef()],
    });
  };

  const updateRefField = (
    index: number,
    field: keyof ReferenceFormRef,
    value: string,
  ) => {
    const newRefs = [...formData.refs];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setFormData({ ...formData, refs: newRefs });
  };

  const updateRefBadgeType = (index: number, badgeType: ReferenceBadgeType) => {
    const newRefs = [...formData.refs];
    newRefs[index] = {
      ...newRefs[index],
      badgeType,
      customBadge: badgeType === "Custom" ? newRefs[index].customBadge : "",
    };
    setFormData({ ...formData, refs: newRefs });
  };

  const removeRefField = (index: number) => {
    const newRefs = formData.refs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      refs: newRefs.length > 0 ? newRefs : [emptyReferenceFormRef()],
    });
  };

  const isFormOpen = isAddingItem || editingItem !== null;
  const isLabelModalOpen = labelModalItemId !== null;

  return (
    <div className="relative min-h-screen bg-transparent px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-xl font-bold text-white sm:text-4xl">
              Machine Learning
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <RoadmapProgressButton
                counts={progressStats.counts}
                totalCount={progressStats.totalCount}
              />
              {isAdmin && (
                <button
                  onClick={() => {
                    setFormData(emptyForm);
                    setEditingItem(null);
                    setIsAddingItem(true);
                  }}
                  className="hidden items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 sm:inline-flex"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              )}
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setFormData(emptyForm);
                setEditingItem(null);
                setIsAddingItem(true);
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 sm:hidden"
            >
              <Plus size={20} />
              Add Item
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-[11px] w-px bg-gradient-to-b from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] opacity-90 md:left-1/2 md:w-0.5 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-6 sm:space-y-10 md:space-y-12">
            {sortedItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const itemLabels = labelsByItem.get(item._id) ?? [];
              const itemStatus = getStatus(itemProgressKey(item._id));

              return (
                <div
                  key={item._id}
                  className={`relative flex items-start md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`min-w-0 flex-1 pl-10 md:w-1/2 md:flex-none md:pl-0 ${
                      isEven ? "md:pr-8 md:pl-0" : "md:pl-8 md:pr-0"
                    }`}
                  >
                    <div className="relative">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <ProgressControl
                          status={itemStatus}
                          onCycle={() => cycleStatus(itemProgressKey(item._id))}
                        />
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="w-full text-left"
                      >
                        <div
                          className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 sm:rounded-lg sm:p-6 ${getItemCardBorderClass(itemStatus)}`}
                        >
                          <h3
                            className={`text-base font-semibold break-words text-white transition-colors sm:text-xl ${
                              itemStatus === "done"
                                ? "line-through opacity-80"
                                : ""
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                      </button>

                      <ItemLabels
                        labels={itemLabels}
                        isAdmin={isAdmin}
                        onAddLabel={() => openAddLabelModal(item._id)}
                        onEditLabel={openEditLabelModal}
                        onDeleteLabel={handleDeleteLabel}
                      />

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

                  <div
                    className={`absolute top-4 left-1.5 z-10 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-slate-900 shadow-lg md:static md:top-auto md:left-auto md:h-4 md:w-4 md:border-4 ${getTimelineDotClass(itemStatus)}`}
                  />

                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-700 bg-slate-800 shadow-2xl sm:max-h-[85vh] sm:rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-detail-title"
          >
            <div className="sticky top-0 flex shrink-0 items-start justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="mb-3">
                  <ProgressControl
                    status={getStatus(itemProgressKey(selectedItem._id))}
                    onCycle={() =>
                      cycleStatus(itemProgressKey(selectedItem._id))
                    }
                  />
                </div>
                <h2
                  id="roadmap-detail-title"
                  className={`text-lg font-bold break-words text-white sm:text-2xl ${
                    getStatus(itemProgressKey(selectedItem._id)) === "done"
                      ? "line-through opacity-80"
                      : ""
                  }`}
                >
                  {selectedItem.title}
                </h2>
              </div>
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
                        <ReferenceBadgeDisplay badge={ref.badge} />
                        <span className="min-w-0 flex-1 break-words">
                          {ref.title}
                        </span>
                        <ExternalLink
                          size={16}
                          className="mt-0.5 shrink-0 sm:mt-0"
                        />
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
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
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
                      className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
                    >
                      <ReferenceBadgePicker
                        badgeType={ref.badgeType}
                        customBadge={ref.customBadge}
                        onBadgeTypeChange={(badgeType) =>
                          updateRefBadgeType(idx, badgeType)
                        }
                        onCustomBadgeChange={(value) =>
                          updateRefField(idx, "customBadge", value)
                        }
                      />
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

      {/* Add / Edit Label Modal */}
      {isLabelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-700 bg-slate-800 shadow-2xl sm:rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="label-form-title"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-700 px-4 py-4 sm:px-6">
              <h2
                id="label-form-title"
                className="text-lg font-bold text-white"
              >
                {editingLabel ? "Edit Label" : "Add Label"}
              </h2>
              <button
                onClick={closeLabelModal}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 px-4 py-5 sm:px-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Label Title *
                </label>
                <input
                  type="text"
                  value={labelTitle}
                  onChange={(e) => setLabelTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveLabel();
                  }}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-base text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none sm:text-sm"
                  placeholder="e.g. What is an ML Engineer?"
                  autoFocus
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-700 pt-4 sm:flex-row">
                <button
                  onClick={closeLabelModal}
                  className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 text-white transition-colors hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLabel}
                  disabled={isSavingLabel}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSavingLabel
                    ? "Saving..."
                    : editingLabel
                      ? "Save Label"
                      : "Add Label"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
