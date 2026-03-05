import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileCheck, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Search, 
  Plus,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
      active 
        ? 'text-emerald-600 bg-emerald-50' 
        : 'text-neutral-500 hover:bg-neutral-100'
    }`}
  >
    <div className={active ? 'text-emerald-600' : 'text-emerald-500'}>
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

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Enseignant");

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
          <span className="text-xl font-bold text-emerald-600">ISIMS Enseignant</span>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4">
          <SidebarSection title="GESTION">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" active />
            <SidebarItem icon={<Users size={18} />} label="Mes Étudiants" />
            <SidebarItem icon={<BookOpen size={18} />} label="Mes Cours" />
            <SidebarItem icon={<Calendar size={18} />} label="Emploi du temps" />
          </SidebarSection>

          <SidebarSection title="ÉVALUATION">
            <SidebarItem icon={<FileCheck size={18} />} label="Saisie des Notes" />
            <SidebarItem icon={<ClipboardList size={18} />} label="Absences" />
          </SidebarSection>

          <SidebarSection title="COMMUNICATION">
            <SidebarItem icon={<MessageSquare size={18} />} label="Messages" />
            <SidebarItem icon={<Bell size={18} />} label="Annonces" />
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
              placeholder="Rechercher un étudiant..." 
              className="bg-transparent outline-none text-sm px-2 w-48"
            />
            <Search size={16} className="text-neutral-400" />
          </div>

          <div className="flex items-center gap-6">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors">
              <Plus size={16} />
              Nouveau Cours
            </button>

            <div className="relative text-neutral-600 cursor-pointer hover:text-emerald-600 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">5</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-neutral-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 bg-neutral-50 flex-grow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Bonjour, Dr. {userName}</h1>
            <p className="text-neutral-500">Voici le résumé de vos activités d'enseignement aujourd'hui.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Total Étudiants</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Users size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">142</span>
              <div className="mt-2 text-xs text-neutral-500">Répartis sur 4 groupes</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Heures de Cours</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Calendar size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">18h</span>
              <div className="mt-2 text-xs text-neutral-500">Cette semaine</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Copies à Corriger</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <FileCheck size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">45</span>
              <div className="mt-2 text-xs text-amber-600 font-bold">Délai : 3 jours</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Cours du Jour</h3>
              <div className="space-y-4">
                {[
                  { time: '08:30 - 10:00', subject: 'Systèmes d\'Exploitation', group: 'L3-CS', room: 'Salle 105' },
                  { time: '10:15 - 11:45', subject: 'Architecture des Ordinateurs', group: 'L2-IT', room: 'Amphi B' },
                  { time: '14:00 - 17:00', subject: 'TP Programmation C', group: 'L1-CS', room: 'Labo Info 2' },
                ].map((course, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="w-24 text-sm font-bold text-emerald-600">{course.time}</div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-neutral-900">{course.subject}</div>
                      <div className="text-xs text-neutral-500">Groupe : {course.group}</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-white rounded border border-neutral-200 text-neutral-600">{course.room}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Dernières Activités</h3>
              <div className="space-y-4">
                {[
                  { action: 'Notes publiées', detail: 'Examen de Mi-Semestre L3-CS', time: 'Il y a 2h' },
                  { action: 'Nouveau message', detail: 'De : Responsable Pédagogique', time: 'Il y a 4h' },
                  { action: 'Absences enregistrées', detail: 'Cours Architecture L2-IT', time: 'Hier' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{activity.action}</div>
                      <div className="text-xs text-neutral-500">{activity.detail}</div>
                      <div className="text-[10px] text-neutral-400 mt-1">{activity.time}</div>
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
