import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Settings, 
  LogOut, 
  User, 
  Search, 
  Bell,
  Activity,
  ScrollText,
  ShieldCheck,
  FileText,
  BarChart3,
  FileQuestion 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
      active 
        ? 'text-violet-600 bg-violet-50' 
        : 'text-neutral-500 hover:bg-neutral-100'
    }`}
  >
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Administrateur");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 flex flex-col bg-white">
        <div className="h-16 flex items-center justify-center border-b border-neutral-200">
          <span className="text-xl font-bold text-violet-600">ISIMS Admin</span>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4">
          <SidebarSection title="ADMINISTRATION">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" active />
            <SidebarItem icon={<Users size={18} />} label="Utilisateurs" />
            <SidebarItem icon={<GraduationCap size={18} />} label="Étudiants" />
            <SidebarItem icon={<Building2 size={18} />} label="Départements" />
          </SidebarSection>

          <SidebarSection title="ACADÉMIQUE">
            <SidebarItem 
              icon={<Calendar size={18} />} 
              label="Emplois du temps" 
              onClick={() => navigate('/admin/schedules')}
            />
            <SidebarItem icon={<FileText size={18} />} label="Examens" />
            <SidebarItem icon={<BarChart3 size={18} />} label="Statistiques" />
            <SidebarItem icon={<FileQuestion size={18} />} label="Questionnaires" />
          </SidebarSection>

          <SidebarSection title="SYSTÈME">
            <SidebarItem icon={<Activity size={18} />} label="Santé Système" />
            <SidebarItem icon={<ScrollText size={18} />} label="Logs" />
            <SidebarItem icon={<ShieldCheck size={18} />} label="Sécurité" />
          </SidebarSection>

          <SidebarSection title="COMPTE">
            <SidebarItem icon={<User size={18} />} label="Mon Profil" />
            <SidebarItem icon={<Settings size={18} />} label="Paramètres" />
            <SidebarItem 
              icon={<LogOut size={18} />} 
              label="Déconnexion" 
              onClick={handleLogout}
            />
          </SidebarSection>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center border border-neutral-200 rounded px-2 py-1">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent outline-none text-sm px-2 w-48"
            />
            <Search size={16} className="text-neutral-400" />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative text-neutral-600 cursor-pointer hover:text-violet-600 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">12</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold border border-violet-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-neutral-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 bg-neutral-50 flex-grow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Console d'Administration</h1>
            <p className="text-neutral-500">Gestion globale de l'établissement ISIMS.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'ÉTUDIANTS', count: '1,240', color: 'text-blue-600', bg: 'bg-blue-100', icon: <Users size={18} /> },
              { title: 'ENSEIGNANTS', count: '85', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <GraduationCap size={18} /> },
              { title: 'DÉPARTEMENTS', count: '6', color: 'text-amber-600', bg: 'bg-amber-100', icon: <Building2 size={18} /> },
              { title: 'ALERTES', count: '3', color: 'text-red-600', bg: 'bg-red-100', icon: <Bell size={18} /> },
            ].map((widget, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase">{widget.title}</span>
                  <div className="text-2xl font-bold text-neutral-900">{widget.count}</div>
                </div>
                <div className={`p-3 rounded-lg ${widget.bg} ${widget.color}`}>
                  {widget.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Activité Récente</h3>
              <div className="space-y-4">
                {[
                  { user: 'Admin System', action: 'Mise à jour du serveur effectuée', time: 'Il y a 10 min' },
                  { user: 'Scolarité', action: 'Importation des listes d\'étudiants L1', time: 'Il y a 45 min' },
                  { user: 'Département IT', action: 'Nouveau planning publié', time: 'Il y a 2h' },
                  { user: 'Système', action: 'Sauvegarde automatique réussie', time: 'Il y a 5h' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold">
                      {log.user.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-neutral-900">{log.user}</div>
                      <div className="text-xs text-neutral-500">{log.action}</div>
                    </div>
                    <div className="text-[10px] text-neutral-400">{log.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Statut des Services</h3>
              <div className="space-y-4">
                {[
                  { name: 'Base de Données', status: 'En ligne', color: 'bg-emerald-500' },
                  { name: 'Serveur Web', status: 'En ligne', color: 'bg-emerald-500' },
                  { name: 'API Mobile', status: 'En ligne', color: 'bg-emerald-500' },
                  { name: 'Serveur Mail', status: 'Ralenti', color: 'bg-amber-500' },
                  { name: 'Sauvegarde', status: 'En ligne', color: 'bg-emerald-500' },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-2">
                    <span className="text-sm text-neutral-600">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-neutral-500">{service.status}</span>
                      <div className={`w-2 h-2 rounded-full ${service.color}`}></div>
                    </div>
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
