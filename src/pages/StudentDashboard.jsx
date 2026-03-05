import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Search, 
  Globe, 
  Maximize, 
  MessageSquare, 
  List, 
  Info,
  Activity,
  ScrollText,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
      active 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-neutral-500 hover:bg-neutral-100'
    }`}
  >
    <div className={active ? 'text-blue-600' : 'text-blue-500'}>
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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Étudiant");

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
          <span className="text-xl font-bold text-blue-600">ISIMS Étudiant</span>
        </div>
        
        <div className="flex-grow overflow-y-auto py-4">
          <SidebarSection title="ACADÉMIQUE">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" active />
            <SidebarItem icon={<BookOpen size={18} />} label="Mes Cours" />
            <SidebarItem icon={<GraduationCap size={18} />} label="Mes Notes" />
            <SidebarItem icon={<Calendar size={18} />} label="Emploi du temps" />
          </SidebarSection>

          <SidebarSection title="DOCUMENTS">
            <SidebarItem icon={<FileText size={18} />} label="Attestations" />
            <SidebarItem icon={<ScrollText size={18} />} label="Ressources" />
          </SidebarSection>

          <SidebarSection title="COMMUNICATION">
            <SidebarItem icon={<Bell size={18} />} label="Notifications" />
            <SidebarItem icon={<MessageSquare size={18} />} label="Messages" />
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
              placeholder="Rechercher un cours..." 
              className="bg-transparent outline-none text-sm px-2 w-48"
            />
            <Search size={16} className="text-neutral-400" />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative text-neutral-600 cursor-pointer hover:text-blue-600 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-neutral-700">{userName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 bg-neutral-50 flex-grow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Bienvenue, {userName} !</h1>
            <p className="text-neutral-500">Voici un aperçu de votre progression académique.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Moyenne Générale</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <GraduationCap size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">14.50</span>
              <div className="mt-2 text-xs text-emerald-600 font-bold">↑ +0.5 par rapport au semestre dernier</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Cours Complétés</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <BookOpen size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">12 / 15</span>
              <div className="mt-2 w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[80%]"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase">Absences</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Clock size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold text-neutral-900">2</span>
              <div className="mt-2 text-xs text-neutral-500">Seuil critique : 5 absences</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Prochains Cours</h3>
              <div className="space-y-4">
                {[
                  { time: '08:30', subject: 'Intelligence Artificielle', room: 'Amphi A', teacher: 'Dr. Ahmed' },
                  { time: '10:15', subject: 'Développement Web', room: 'Labo 3', teacher: 'Mme. Sarah' },
                  { time: '14:00', subject: 'Réseaux Mobiles', room: 'Salle 12', teacher: 'Mr. Karim' },
                ].map((course, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                    <div className="w-16 text-sm font-bold text-blue-600">{course.time}</div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-neutral-900">{course.subject}</div>
                      <div className="text-xs text-neutral-500">{course.teacher}</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded text-neutral-600">{course.room}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4">Dernières Notes</h3>
              <div className="space-y-4">
                {[
                  { subject: 'Base de Données', type: 'DS1', grade: '16/20', date: 'Hier' },
                  { subject: 'Anglais Technique', type: 'Test', grade: '18/20', date: 'Il y a 3 jours' },
                  { subject: 'Algorithmique', type: 'Examen', grade: '13.5/20', date: 'La semaine dernière' },
                ].map((note, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{note.subject}</div>
                      <div className="text-xs text-neutral-500">{note.type} • {note.date}</div>
                    </div>
                    <div className="text-lg font-black text-blue-600">{note.grade}</div>
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
