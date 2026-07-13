import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School, 
  Grid, 
  LogOut, 
  Menu, 
  X,
  User,
  Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Student Management', path: '/admin/dashboard?tab=students', icon: GraduationCap },
    { name: 'Teacher Management', path: '/admin/dashboard?tab=teachers', icon: Users },
    { name: 'Classroom Management', path: '/admin/dashboard?tab=classrooms', icon: School },
    { name: 'Seat Allocation', path: '/admin/dashboard?tab=allocate', icon: Grid },
    { name: 'View Seat Allocation', path: '/admin/dashboard?tab=view-allocations', icon: Grid },
  ];

  if (!user) return <>{children}</>;

  // Simple clean navbar for Student & Teacher
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <header className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-lg shadow-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-650 p-2 rounded-lg text-white shadow-md shadow-indigo-600/35">
              <School size={22} />
            </div>
            <h1 className="font-bold text-lg tracking-wider text-slate-100 uppercase">
              Smart Exam Portal
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50">
              <User size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">{user.name}</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full capitalize font-semibold">
                {user.role}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 hover:border-red-500/30 transition-all duration-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    );
  }

  // Heavy sidebar layout for Admin
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-wider text-white uppercase">Exam Admin</h2>
            <span className="text-xs text-indigo-400 font-semibold tracking-wide uppercase">Dashboard Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = (link.path === '/admin/dashboard')
              ? (location.pathname + location.search === '/admin/dashboard' || location.pathname + location.search === '/admin/dashboard?tab=overview')
              : (location.pathname + location.search === link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-80 bg-slate-900 h-full border-r border-slate-800 shadow-2xl animate-slide-in">
            <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-650 p-2.5 rounded-xl text-white">
                  <Shield size={24} />
                </div>
                <h2 className="font-bold text-base tracking-wider text-white uppercase">Exam Admin</h2>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = (link.path === '/admin/dashboard')
                  ? (location.pathname + location.search === '/admin/dashboard' || location.pathname + location.search === '/admin/dashboard?tab=overview')
                  : (location.pathname + location.search === link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile bottom spacer */}
            <div className="p-4 border-t border-slate-800/60 text-center text-[10px] text-slate-650 font-bold tracking-wider uppercase">
              Smart Exam Portal
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified Top Header Bar */}
        <header className="glass px-6 py-4 flex items-center justify-between border-b border-slate-800/60 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-slate-350 hover:text-white rounded-lg border border-slate-800 bg-slate-900/60 transition-all"
            >
              <Menu size={20} />
            </Button>
            <h1 className="lg:hidden font-extrabold text-base tracking-wider text-white uppercase">Exam Admin</h1>
          </div>
          
          {/* User profile info & Top Logout Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-850/80">
              <User size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-slate-350">{user.name}</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-850 hover:bg-red-500/20 hover:text-red-300 text-slate-355 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border border-slate-800 hover:border-red-550/20 transition-all duration-300 active:scale-[0.97]"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
