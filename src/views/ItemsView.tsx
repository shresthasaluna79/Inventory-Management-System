import { useEffect, useState, useCallback } from "react";
import {
  Plus, Search, Filter, ChevronDown, Pencil, Trash2,
  Package, Loader2, X, AlertCircle, AlertTriangle,
} from "lucide-react";
import {
  getItems, getCategories, createItem, updateItem, deleteItem,
  type Item, type Category, type ItemCreate, type ItemUpdate,
} from "../api/inventory";

// ── helpers ───────────────────────────────────────────────────────────────────

const stockBadge = (qty: number, reorder: number) => {
  if (qty === 0) return "bg-red-100 text-red-700 border-red-200";
  if (reorder > 0 && qty <= reorder) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
};

const stockLabel = (qty: number, reorder: number) => {
  if (qty === 0) return "Out of Stock";
  if (reorder > 0 && qty <= reorder) return "Low Stock";
  return "In Stock";
};

// ── Item Form ─────────────────────────────────────────────────────────────────

interface ItemFormProps {
  categories: Category[];
  initial?: Partial<ItemCreate>;
  onSubmit: (data: ItemCreate) => Promise<void>;
  onClose: () => void;
  submitLabel: string;
  error: string | null;
  loading: boolean;
}

function ItemForm({ categories, initial, onSubmit, onClose, submitLabel, error, loading }: ItemFormProps) {
  const [form, setForm] = useState<ItemCreate>({
    name: initial?.name ?? "",
    description: initial?.description ?? null,
    category_id: initial?.category_id ?? (categories[0]?.id ?? 0),
    quantity: initial?.quantity ?? 0,
    unit: initial?.unit ?? null,
    unit_price: initial?.unit_price ?? null,
    sku: initial?.sku ?? null,
    location: initial?.location ?? null,
    reorder_level: initial?.reorder_level ?? 0,
    notes: initial?.notes ?? null,
  });

  const set = (field: keyof ItemCreate, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            autoFocus
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Item name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={form.category_id}
              onChange={(e) => set("category_id", Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">SKU</label>
          <input
            value={form.sku ?? ""}
            onChange={(e) => set("sku", e.target.value || null)}
            placeholder="e.g. EL-001"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) => set("quantity", Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Unit</label>
          <input
            value={form.unit ?? ""}
            onChange={(e) => set("unit", e.target.value || null)}
            placeholder="pcs, kg, box…"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Unit Price ($)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.unit_price ?? ""}
            onChange={(e) => set("unit_price", e.target.value ? e.target.value : null)}
            placeholder="0.00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Reorder Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Reorder Level</label>
          <input
            type="number"
            min={0}
            value={form.reorder_level ?? 0}
            onChange={(e) => set("reorder_level", Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Location</label>
          <input
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value || null)}
            placeholder="e.g. Warehouse A, Shelf 3"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea
            rows={2}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value || null)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Notes</label>
          <textarea
            rows={2}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value || null)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !form.name.trim() || !form.category_id}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function ItemsView() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");

  // Create
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Edit
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsData, catsData] = await Promise.all([
        getItems({
          category_id: categoryFilter !== "" ? categoryFilter : undefined,
          search: search.trim() || undefined,
        }),
        getCategories(),
      ]);
      setItems(itemsData);
      setCategories(catsData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { load(); }, 350);
    return () => clearTimeout(t);
  }, [load]);

  const handleCreate = async (data: ItemCreate) => {
    setCreating(true);
    setCreateError(null);
    try {
      await createItem(data);
      setShowCreate(false);
      await load();
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : "Error creating item");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (data: ItemUpdate) => {
    if (!editItem) return;
    setEditSaving(true);
    setEditError(null);
    try {
      await updateItem(editItem.id, data);
      setEditItem(null);
      await load();
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Error saving item");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await deleteItem(id);
      setDeleteId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting item");
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Items</h1>
          <p className="text-slate-500 text-sm mt-0.5">All inventory items across categories</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(null); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, location…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value === "" ? "" : Number(e.target.value))}
            className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {(search || categoryFilter !== "") && (
          <button
            onClick={() => { setSearch(""); setCategoryFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}

        <span className="ml-auto text-slate-400 text-xs">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["SKU", "Name", "Category", "Stock", "Qty / Unit", "Unit Price", "Location", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4">
                      {item.sku ? (
                        <span className="font-mono text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg">
                          {item.sku}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-800 text-sm font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-slate-400 text-xs mt-0.5 truncate max-w-[200px]">{item.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-600 text-sm">{item.category.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${stockBadge(item.quantity, item.reorder_level ?? 0)}`}>
                        {item.quantity === 0 && <AlertTriangle className="w-3 h-3" />}
                        {stockLabel(item.quantity, item.reorder_level ?? 0)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-800 font-semibold text-sm">{item.quantity}</span>
                      {item.unit && <span className="text-slate-400 text-xs ml-1">{item.unit}</span>}
                    </td>
                    <td className="px-5 py-4">
                      {item.unit_price ? (
                        <span className="text-slate-700 text-sm">
                          ${parseFloat(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-500 text-sm">{item.location ?? <span className="text-slate-300 italic">—</span>}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditItem(item); setEditError(null); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">No items match your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 py-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4 my-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-bold text-lg">Add New Item</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ItemForm
              categories={categories}
              onSubmit={handleCreate}
              onClose={() => setShowCreate(false)}
              submitLabel="Create Item"
              error={createError}
              loading={creating}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 py-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4 my-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-bold text-lg">Edit Item</h2>
              <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ItemForm
              categories={categories}
              initial={editItem}
              onSubmit={handleEdit}
              onClose={() => setEditItem(null)}
              submitLabel="Save Changes"
              error={editError}
              loading={editSaving}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-slate-800 font-bold text-lg mb-2">Delete Item?</h2>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
