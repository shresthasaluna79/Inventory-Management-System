import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Sidebar, { NavView } from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DashboardView from "./views/DashboardView";
import ItemsView from "./views/ItemsView";
import CategoriesView from "./views/CategoriesView";
import { type AuthUser } from "./api/inventory";

function AppLayout({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentNav = ((): NavView => {
    if (location.pathname.startsWith("/items")) return "items";
    if (location.pathname.startsWith("/categories")) return "categories";
    return "dashboard";
  })();

  const handleNavigate = (nav: NavView) => {
    navigate(nav === "dashboard" ? "/" : `/${nav}`);
  };

  const renderContent = () => {
    switch (currentNav) {
      case "dashboard":  return <DashboardView />;
      case "items":      return <ItemsView />;
      case "categories": return <CategoriesView />;
      default:           return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeView={currentNav} onNavigate={handleNavigate} onLogout={onLogout} />
      <TopNavbar user={user} onLogout={onLogout} />
      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-6 max-w-[1400px]">{renderContent()}</div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  if (!user) {
    return (
      <BrowserRouter>
        <LoginPage onLogin={(u) => setUser(u)} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<AppLayout user={user} onLogout={() => setUser(null)} />} />
        <Route path="/items"      element={<AppLayout user={user} onLogout={() => setUser(null)} />} />
        <Route path="/categories" element={<AppLayout user={user} onLogout={() => setUser(null)} />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
