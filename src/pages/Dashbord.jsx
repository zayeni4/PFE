import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  CreditCard, 
  Truck, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Search, 
  Globe, 
  Moon, 
  Maximize, 
  MessageSquare, 
  List, 
  Info,
  Activity,
  ScrollText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
    active 
      ? 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' 
      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
  }`}>
    <div className={active ? 'text-violet-600' : 'text-violet-500'}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const SidebarSection = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="px-4 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{title}</h3>
    <div className="flex flex-col">
      {children}
    </div>
  </div>
);

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
        <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xl font-bold text-violet-600">lamadmin</span>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4">
          <SidebarSection title="MAIN">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          </SidebarSection>

          <SidebarSection title="LISTS">
            <SidebarItem icon={<Users size={18} />} label="Users" />
            <SidebarItem icon={<Store size={18} />} label="Products" />
            <SidebarItem icon={<CreditCard size={18} />} label="Orders" />
            <SidebarItem icon={<Truck size={18} />} label="Delivery" />
          </SidebarSection>

          <SidebarSection title="USEFUL">
            <SidebarItem icon={<BarChart3 size={18} />} label="Stats" />
            <SidebarItem icon={<Bell size={18} />} label="Notifications" />
          </SidebarSection>

          <SidebarSection title="SERVICE">
            <SidebarItem icon={<Activity size={18} />} label="System Health" />
            <SidebarItem icon={<ScrollText size={18} />} label="Logs" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </SidebarSection>

          <SidebarSection title="USER">
            <SidebarItem icon={<User size={18} />} label="Profile" />
            <SidebarItem icon={<LogOut size={18} />} label="Logout" />
          </SidebarSection>

          <SidebarSection title="THEME">
            <div className="flex gap-3 px-4 mt-2">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`w-8 h-8 rounded border-2 ${theme === 'light' ? 'border-violet-600 bg-white' : 'border-neutral-300 bg-white'}`}
              />
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`w-8 h-8 rounded border-2 ${theme === 'dark' ? 'border-violet-600 bg-neutral-800' : 'border-neutral-300 bg-neutral-800'}`}
              />
            </div>
          </SidebarSection>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-900">
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent outline-none text-sm px-2 w-48 dark:text-white"
            />
            <Search size={16} className="text-neutral-400" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-violet-600 transition-colors">
              <Globe size={18} />
              <span className="text-sm">English</span>
            </div>
            
            <button onClick={toggleTheme} className="text-neutral-600 dark:text-neutral-400 hover:text-violet-600 transition-colors">
              <Moon size={18} />
            </button>

            <button className="text-neutral-600 dark:text-neutral-400 hover:text-violet-600 transition-colors">
              <Maximize size={18} />
            </button>

            <div className="relative text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-violet-600 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>

            <div className="relative text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-violet-600 transition-colors">
              <MessageSquare size={18} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </div>

            <button className="text-neutral-600 dark:text-neutral-400 hover:text-violet-600 transition-colors">
              <List size={18} />
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
            </div>

            <button className="text-neutral-600 dark:text-neutral-400 hover:text-violet-600 transition-colors">
              <Settings size={18} />
            </button>

            <button className="text-neutral-600 dark:text-neutral-400 hover:text-violet-600 transition-colors">
              <Info size={18} />
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 bg-neutral-50 dark:bg-neutral-950 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Placeholder Widgets */}
            {[
              { title: 'USERS', count: '100', link: 'See all users', color: 'text-red-600', bg: 'bg-red-100' },
              { title: 'ORDERS', count: '215', link: 'View all orders', color: 'text-amber-600', bg: 'bg-amber-100' },
              { title: 'EARNINGS', count: '$ 4.6k', link: 'View net earnings', color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { title: 'BALANCE', count: '$ 2.1k', link: 'See details', color: 'text-violet-600', bg: 'bg-violet-100' },
            ].map((widget, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex justify-between"
              >
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase">{widget.title}</span>
                  <span className="text-2xl font-medium text-neutral-900 dark:text-white">{widget.count}</span>
                  <span className="text-xs border-b border-neutral-300 dark:border-neutral-700 w-fit cursor-pointer text-neutral-600 dark:text-neutral-400">{widget.link}</span>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <div className="text-emerald-600 text-xs font-bold">↑ 20 %</div>
                  <div className={`p-1.5 rounded ${widget.bg} ${widget.color}`}>
                    <User size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-neutral-500 font-medium mb-4">Total Revenue</h3>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-32 h-32 rounded-full border-8 border-violet-600 border-t-neutral-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">70%</span>
                </div>
                <p className="text-neutral-500 text-sm mb-2">Total sales made today</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">$420</p>
                <p className="text-xs text-neutral-400 text-center mt-4">Previous transactions processing. Last payments may not be included.</p>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-neutral-500 font-medium mb-4">Last 6 Months (Revenue)</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 60, 30, 80, 50, 90].map((h, i) => (
                  <div key={i} className="flex-grow flex flex-col items-center gap-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full bg-violet-200 dark:bg-violet-900/40 rounded-t-lg relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${h * 100}
                      </div>
                    </motion.div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Month {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
