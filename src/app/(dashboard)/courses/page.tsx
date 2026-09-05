"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTenant } from "@/lib/tenant-context";
import { Offer } from "@/types";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Edit2,
  ExternalLink,
  CheckCircle2,
  Clock,
  DollarSign,
  Tag,
  X,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function CoursesContent() {
  const { tenant } = useTenant();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Offer[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<Offer | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Draft" | "Archived">("Active");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const qSearch = searchParams.get("search");
    if (qSearch) setSearch(qSearch);
  }, [searchParams]);

  const loadCourses = () => {
    setIsLoading(true);
    fetch(`/api/courses?tenantId=${tenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, [tenant.id]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase();
      const matches =
        !search ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      if (!matches) return false;
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      return true;
    });
  }, [courses, search, selectedCategory]);

  const openEditModal = (course: Offer) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditPrice(course.displayedOfferPrice || course.price);
    setEditDuration(course.duration);
    setEditDescription(course.description);
    setEditStatus(course.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: editingCourse.id,
          data: {
            title: editTitle,
            price: editPrice,
            displayedOfferPrice: editPrice,
            duration: editDuration,
            description: editDescription,
            status: editStatus,
          },
          requestedTenant: tenant.id,
        }),
      });

      if (res.ok) {
        setEditingCourse(null);
        loadCourses();
      }
    } catch (err) {
      console.error("Failed to update course:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Course Catalog Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {courses.length} Approved Programs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified course curriculums, pricing tiers, durations, and AI grounding sources of truth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-slate-100 text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-slate-100 text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {course.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{course.description}</p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-blue-900" />
                    <span>{course.displayedOfferPrice || course.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {course.inquiryCount || 32} prospective inquiries
                </span>
                <button
                  onClick={() => openEditModal(course)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Course Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Pricing</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{c.title}</td>
                  <td className="px-5 py-3.5">{c.category}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-blue-900">
                    {c.displayedOfferPrice || c.price}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{c.duration}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openEditModal(c)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Course Offering</h3>
                <p className="text-xs text-slate-500">Updates sync directly with AI Grounding and CRM.</p>
              </div>
              <button onClick={() => setEditingCourse(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Approved Price *</label>
                  <input
                    type="text"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="₹49,999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="12 Weeks"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "Active" | "Draft" | "Archived")}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        </div>
      }
    >
      <CoursesContent />
    </React.Suspense>
  );
}

