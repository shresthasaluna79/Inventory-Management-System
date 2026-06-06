import { useEffect, useState } from "react";
import {
  Package,
  Layers,
  Tag,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getSummary, getCategories, type InventorySummary, type Category } from "../api/inventory";

export default function DashboardView() {
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, c] = await Promise.all([getSummary(), getCategories()]);
      setSummary(s);
      setCategories(c);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = summary
    ? [
        {
          label: "Total Items",
          value: summary.total_items,
          icon: Package,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          accent: "border-l-blue-500",
        },
        {
          label: "Total Quantity",
          value: summary.total_quantity.toLocaleString(),
          icon: Layers,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          accent: "border-l-emerald-500",
        },
        {
          label: "Categories",
          value: summary.total_categories,
          icon: Tag,
          iconBg: "bg-violet-100",
          iconColor: "text-violet-600",
          accent: "border-l-violet-500",
        },
        {
          label: "Low Stock",
          value: summary.low_stock_count,
          icon: AlertTriangle,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          accent: "border-l-amber-500",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Live overview of your inventory
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-slate-200 p-5 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-white rounded-xl border border-slate-200 border-l-4 ${kpi.accent} p-5 hover:shadow-md transition-shadow`}
            >
              <div
                className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center mb-4`}
              >
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {kpi.value}
              </div>
              <div className="text-slate-500 text-sm font-medium">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <h2 className="text-slate-800 font-semibold text-sm">
            Items by Category
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-slate-400 text-sm py-6 text-center">
            No categories yet. Add some from the Categories page.
          </p>
        ) : (
          <div className="space-y-3.5">
            {categories.map((cat) => {
              const max = Math.max(...categories.map((c) => c.item_count), 1);
              const pct = Math.round((cat.item_count / max) * 100);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-700 text-sm font-medium">
                      {cat.name}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {cat.item_count} item{cat.item_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {summary && summary.low_stock_count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-semibold text-sm">
              {summary.low_stock_count} item
              {summary.low_stock_count !== 1 ? "s are" : " is"} at or below
              reorder level
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              Review the Items page and restock as needed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
