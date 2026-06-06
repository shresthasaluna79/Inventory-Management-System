import { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { type AuthUser } from '../api/inventory';

interface TopNavbarProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function TopNavbar({ user, onLogout }: TopNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleColor =
    user.role === 'Admin'   ? 'text-blue-500' :
    user.role === 'Manager' ? 'text-violet-500' :
    'text-emerald-500';

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search assets, serials, tags..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Bell className="w-[18px] h-[18px]" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
          >
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-slate-800 text-sm font-semibold leading-none">{user.name}</div>
              <div className={`text-xs mt-0.5 font-medium ${roleColor}`}>{user.role}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl shadow-slate-200/80 border border-slate-100 py-1.5 z-20">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="text-slate-800 text-sm font-semibold">{user.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                  <div className={`text-xs font-semibold mt-1 ${roleColor}`}>{user.role}</div>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
