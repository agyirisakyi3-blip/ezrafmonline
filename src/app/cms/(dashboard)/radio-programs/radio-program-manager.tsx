"use client";

import { useState } from "react";

type Program = {
  id: string;
  title: string;
  host: string | null;
  startTime: string;
  endTime: string;
  days: string;
  description: string | null;
  active: boolean;
  sortOrder: number;
};

const emptyForm = {
  title: "",
  host: "",
  startTime: "06:00",
  endTime: "07:00",
  days: "weekdays",
  description: "",
  sortOrder: 0,
};

const dayOptions = [
  { value: "weekdays", label: "Weekdays (Mon-Fri)" },
  { value: "weekends", label: "Weekends (Sat-Sun)" },
  { value: "daily", label: "Daily" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function RadioProgramManager({
  programs: initial,
}: {
  programs: Program[];
}) {
  const [programs, setPrograms] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function editProgram(p: Program) {
    setForm({
      title: p.title,
      host: p.host ?? "",
      startTime: p.startTime,
      endTime: p.endTime,
      days: p.days,
      description: p.description ?? "",
      sortOrder: p.sortOrder,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const url = "/api/admin/radio-programs";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { id: editingId, ...form, host: form.host || null, description: form.description || null }
        : { ...form, host: form.host || null, description: form.description || null };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();

      if (isEdit) {
        setPrograms((prev) => prev.map((p) => (p.id === editingId ? saved : p)));
      } else {
        setPrograms((prev) => [...prev, saved]);
      }

      resetForm();
    } catch {
      alert("Failed to save program");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: Program) {
    const res = await fetch("/api/admin/radio-programs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });

    if (res.ok) {
      const updated = await res.json();
      setPrograms((prev) => prev.map((pr) => (pr.id === p.id ? updated : pr)));
    }
  }

  async function deleteProgram(id: string) {
    if (!confirm("Delete this program?")) return;

    const res = await fetch("/api/admin/radio-programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const items = [...programs];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setPrograms(items);
    void saveOrder(items);
  }

  function moveDown(index: number) {
    if (index === programs.length - 1) return;
    const items = [...programs];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setPrograms(items);
    void saveOrder(items);
  }

  async function saveOrder(items: Program[]) {
    for (let i = 0; i < items.length; i++) {
      await fetch("/api/admin/radio-programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: items[i].id, sortOrder: i }),
      });
    }
  }

  function formatDays(days: string) {
    const map: Record<string, string> = {
      weekdays: "Mon–Fri",
      weekends: "Sat–Sun",
      daily: "Daily",
      monday: "Mon", tuesday: "Tue", wednesday: "Wed",
      thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
    };
    return map[days] || days;
  }

  const dayLabel = (d: string) => dayOptions.find((o) => o.value === d)?.label || d;

  return (
    <div className="space-y-5">
      <button
        onClick={() => { resetForm(); setShowForm(!showForm); }}
        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {showForm ? "Cancel" : "Add Program"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200/70 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Program Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Ezra Adekyee"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Host(s)</label>
              <input
                type="text"
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Rev. Kofi Asante Ennin & Sir Mike"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Days</label>
              <select
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {dayOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Brief description of the program"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Program" : "Add Program"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {programs.map((p, i) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border p-4 transition-all ${
              p.active ? "border-zinc-200/70" : "border-zinc-100 bg-zinc-50/50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-zinc-900 text-sm">{p.title}</h3>
                  {!p.active && (
                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">inactive</span>
                  )}
                </div>
                {p.host && (
                  <p className="text-xs text-zinc-500 mb-1">{p.host}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="font-mono font-medium text-zinc-600">{p.startTime} – {p.endTime}</span>
                  <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-zinc-500">
                    {formatDays(p.days)}
                  </span>
                  {p.description && (
                    <span className="text-zinc-400 truncate hidden sm:inline">{p.description}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="h-7 w-7 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Move up"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === programs.length - 1}
                  className="h-7 w-7 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Move down"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleActive(p)}
                  className={`h-7 w-7 rounded-lg transition-all flex items-center justify-center ${
                    p.active
                      ? "text-emerald-500 hover:bg-emerald-50"
                      : "text-zinc-300 hover:bg-zinc-100"
                  }`}
                  title={p.active ? "Deactivate" : "Activate"}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => editProgram(p)}
                  className="h-7 w-7 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all flex items-center justify-center"
                  title="Edit"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteProgram(p.id)}
                  className="h-7 w-7 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all flex items-center justify-center"
                  title="Delete"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200/70 p-10 text-center">
            <svg className="mx-auto h-10 w-10 text-zinc-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <p className="text-zinc-500 text-sm">No programs yet. Click &quot;Add Program&quot; to create your radio schedule.</p>
          </div>
        )}
      </div>
    </div>
  );
}
