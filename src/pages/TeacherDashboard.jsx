import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, FileCheck, MessageSquare, Bell, 
  Settings, LogOut, User, Search, Plus, Calendar, ClipboardList,
  Sun, Moon, BarChart3, ChevronRight, TrendingUp, ScrollText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${active ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}>
    <div className={active ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-400'}>{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const SidebarSection = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="px-4 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{title}</h3>
    <div className="flex flex-col">{children}</div>
  </div>
);

const getStats = (question, responses) => {
  if (!responses?.length || question.type !== 'choice') return null;
  const stats = {};
  question.options.forEach(opt => stats[opt] = 0);
  responses.forEach(r => {
    const a = r.answers?.[question.id];
    if (a && stats[a] !== undefined) stats[a]++;
  });
  return stats;
};

function QuestionnaireAnalysis({ questionnaire, onBack }) {
  const responses = questionnaire.responses || [];
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold text-sm uppercase tracking-widest transition-colors">
        ← Retour aux analyses
      </button>
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white">
        <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">{questionnaire.subject}</p>
        <h2 className="text-2xl font-black mb-1">{questionnaire.title}</h2>
        <p className="text-emerald-100 text-sm">Responsable : {questionnaire.teacher || 'Non assigné'}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Réponses', value: responses.length, icon: <Users size={18} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Questions', value: questionnaire.questions?.length || 0, icon: <ScrollText size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Complétion', value: responses.length > 0 ? '100%' : '0%', icon: <TrendingUp size={18} />, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
      {responses.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400"><BarChart3 size={32} /></div>
          <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Aucune réponse pour le moment</h3>
          <p className="text-neutral-500 text-sm">Les étudiants n'ont pas encore répondu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questionnaire.questions?.map((q, i) => {
            const stats = getStats(q, responses);
            return (
              <div key={q.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h4 className="font-bold text-neutral-900 dark:text-white mb-4 text-sm"><span className="text-neutral-400 mr-2">{i + 1}.</span>{q.title}</h4>
                {q.type === 'choice' && stats ? (
                  <div className="space-y-3">
                    {Object.entries(stats).map(([opt, count]) => {
                      const pct = Math.round((count / responses.length) * 100);
                      return (
                        <div key={opt}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">{opt}</span>
                            <span className="text-neutral-500 font-bold">{count} — {pct}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {responses.slice(0, 5).map((r, ri) => (
                      <div key={ri} className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg text-sm text-neutral-700 dark:text-neutral-300">
                        {r.answers?.[q.id] || <span className="italic text-neutral-400">Pas de réponse</span>}
                      </div>
                    ))}
                    {responses.length > 5 && <p className="text-xs text-neutral-400 text-center">+{responses.length - 5} autres...</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userName, setUserName]   = useState("Enseignant");
  const [activeView, setActiveView] = useState('dashboard');
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQ, setSelectedQ] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
  }, []);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('questionnaires');
      if (saved) setQuestionnaires(JSON.parse(saved).filter(q => q.sentToStudents));
    };
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate('/login');
  };

  const bySubject = questionnaires.reduce((acc, q) => {
    const key = q.subject || 'Sans matière';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
        <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
          <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xl font-bold text-emerald-600">ISIMS Enseignant</span>
          </div>
          <div className="flex-grow overflow-y-auto py-4">
            <SidebarSection title="GESTION">
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setSelectedQ(null); }} />
              <SidebarItem icon={<Users size={18} />} label="Mes Étudiants" />
              <SidebarItem icon={<BookOpen size={18} />} label="Mes Cours" />
              <SidebarItem icon={<Calendar size={18} />} label="Emploi du temps" />
            </SidebarSection>
            <SidebarSection title="ÉVALUATION">
              <SidebarItem icon={<FileCheck size={18} />} label="Saisie des Notes" />
              <SidebarItem icon={<BarChart3 size={18} />} label="Analyses Questionnaires" active={activeView === 'analytics'} onClick={() => { setActiveView('analytics'); setSelectedQ(null); }} />
              <SidebarItem icon={<ClipboardList size={18} />} label="Absences" />
            </SidebarSection>
            <SidebarSection title="COMMUNICATION">
              <SidebarItem icon={<MessageSquare size={18} />} label="Messages" />
              <SidebarItem icon={<Bell size={18} />} label="Annonces" />
            </SidebarSection>
            <SidebarSection title="COMPTE">
              <SidebarItem icon={<User size={18} />} label="Mon Profil" />
              <SidebarItem icon={<Settings size={18} />} label="Paramètres" />
              <SidebarItem icon={<LogOut size={18} />} label="Déconnexion" onClick={handleLogout} />
            </SidebarSection>
          </div>
        </aside>

        <div className="flex-grow flex flex-col">
          <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-900">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1">
              <input type="text" placeholder="Rechercher..." className="bg-transparent outline-none text-sm px-2 w-48 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400" />
              <Search size={16} className="text-neutral-400" />
            </div>
            <div className="flex items-center gap-6">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                <Plus size={16} /> Nouveau Cours
              </button>
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="relative text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-emerald-600">
                <Bell size={18} />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">5</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-700">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{userName}</span>
              </div>
            </div>
          </header>

          <main className="p-6 bg-neutral-50 dark:bg-neutral-950 flex-grow overflow-y-auto">

            {activeView === 'dashboard' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Bonjour, Dr. {userName}</h1>
                  <p className="text-neutral-500 dark:text-neutral-400">Voici le résumé de vos activités aujourd'hui.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Étudiants', value: '142', sub: 'Répartis sur 4 groupes', icon: <Users size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'Heures de Cours', value: '18h', sub: 'Cette semaine', icon: <Calendar size={18} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                    { label: 'Copies à Corriger', value: '45', sub: 'Délai : 3 jours', icon: <FileCheck size={18} />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-neutral-400 uppercase">{s.label}</span>
                        <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>{s.icon}</div>
                      </div>
                      <span className="text-3xl font-bold text-neutral-900 dark:text-white">{s.value}</span>
                      <div className={`mt-2 text-xs font-bold ${i === 2 ? 'text-amber-600' : 'text-neutral-500 dark:text-neutral-400'}`}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {questionnaires.length > 0 && (
                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900 dark:text-white">Questionnaires actifs — mes matières</h3>
                      <button onClick={() => setActiveView('analytics')} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                        Voir toutes les analyses <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {questionnaires.slice(0, 4).map(q => (
                        <div key={q.id} onClick={() => { setActiveView('analytics'); setSelectedQ(q); }}
                          className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors border border-neutral-100 dark:border-neutral-700 group"
                        >
                          <div>
                            <div className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">{q.title}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{q.subject}{q.teacher ? ` • ${q.teacher}` : ''}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-neutral-400">{q.responses?.length || 0} rép.</span>
                            <BarChart3 size={16} className="text-emerald-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Cours du Jour</h3>
                    <div className="space-y-4">
                      {[
                        { time: '08:30 - 10:00', subject: "Systèmes d'Exploitation", group: 'L3-CS', room: 'Salle 105' },
                        { time: '10:15 - 11:45', subject: 'Architecture des Ordinateurs', group: 'L2-IT', room: 'Amphi B' },
                        { time: '14:00 - 17:00', subject: 'TP Programmation C', group: 'L1-CS', room: 'Labo Info 2' },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                          <div className="w-24 text-sm font-bold text-emerald-600 dark:text-emerald-400">{c.time}</div>
                          <div className="flex-grow">
                            <div className="text-sm font-bold text-neutral-900 dark:text-white">{c.subject}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Groupe : {c.group}</div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">{c.room}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Dernières Activités</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'Notes publiées', detail: 'Examen de Mi-Semestre L3-CS', time: 'Il y a 2h' },
                        { action: 'Nouveau message', detail: 'De : Responsable Pédagogique', time: 'Il y a 4h' },
                        { action: 'Absences enregistrées', detail: 'Cours Architecture L2-IT', time: 'Hier' },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                          <div>
                            <div className="text-sm font-bold text-neutral-900 dark:text-white">{a.action}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{a.detail}</div>
                            <div className="text-[10px] text-neutral-400 mt-1">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeView === 'analytics' && (
              selectedQ ? (
                <QuestionnaireAnalysis questionnaire={selectedQ} onBack={() => setSelectedQ(null)} />
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Analyses des Questionnaires</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Consultez les réponses de vos étudiants par matière.</p>
                  </div>
                  {questionnaires.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-16 text-center">
                      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600"><BarChart3 size={40} /></div>
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Aucun questionnaire publié</h2>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">L'administrateur doit publier des questionnaires.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {Object.entries(bySubject).map(([subject, qs]) => (
                        <div key={subject}>
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={16} className="text-emerald-600" />
                            <h2 className="text-sm font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">{subject}</h2>
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{qs.length}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qs.map(q => (
                              <div key={q.id} onClick={() => setSelectedQ(q)}
                                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors text-sm flex-grow pr-2">{q.title}</h3>
                                  <ChevronRight size={16} className="text-neutral-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                                  {q.teacher && <span>{q.teacher}</span>}
                                  <span className="flex items-center gap-1"><BarChart3 size={11} />{q.responses?.length || 0} réponse{(q.responses?.length || 0) > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-grow bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(((q.responses?.length || 0) / 30) * 100, 100)}%` }} />
                                  </div>
                                  <span className="text-[10px] text-neutral-400 font-bold">{q.responses?.length || 0}/30</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}