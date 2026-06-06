import { Shield, LayoutDashboard, Package, Tag, Settings, LogOut } from "lucide-react";

export type NavView = "dashboard" | "items" | "categories";

interface SidebarProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  onLogout: () => void;
}

const navItems: { id: NavView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "items", label: "Items", icon: Package },
  { id: "categories", label: "Categories", icon: Tag },
];

export default function Sidebar({ activeView, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">Inventory</div>
            <div className="text-blue-400 text-xs font-medium mt-0.5">Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-150">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
