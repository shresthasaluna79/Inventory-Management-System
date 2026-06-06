import { useState } from 'react';
import { Shield, Phone, Mail, CheckCircle, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginUser, type AuthUser } from '../api/inventory';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Inventory Pro</span>
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Inventory<br />
              <span className="text-blue-400">Management System</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Track, manage, and organize your inventory with ease. Full visibility across all categories and items.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 text-sm font-medium">System Status: Active</span>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-10 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Demo Credentials</p>
            <div className="space-y-1.5 text-sm">
              {[
                { email: 'alice@inventory.com',  role: 'Admin',   pw: 'Alice@123'  },
                { email: 'bob@inventory.com',    role: 'Manager', pw: 'Bob@123'    },
                { email: 'carol@inventory.com',  role: 'Staff',   pw: 'Carol@123'  },
              ].map((c) => (
                <div key={c.email} className="flex items-center justify-between gap-4">
                  <span className="text-slate-300 font-mono text-xs">{c.email}</span>
                  <span className="text-slate-500 font-mono text-xs">{c.pw}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.role === 'Admin' ? 'bg-blue-900 text-blue-300' :
                    c.role === 'Manager' ? 'bg-violet-900 text-violet-300' :
                    'bg-slate-700 text-slate-300'
                  }`}>{c.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-slate-700/50 pt-8">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">IT Helpdesk</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>+1 (800) 555-0192 ext. 4</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>support@inventory.corp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-800 font-bold text-lg">Inventory Pro</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@inventory.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRememberDevice(!rememberDevice)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    rememberDevice ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  {rememberDevice && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className="text-sm text-slate-600">Remember this device for 30 days</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-150 text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Inventory Pro &copy; 2025 &mdash; Enterprise Edition
          </p>
        </div>
      </div>
    </div>
  );
}
