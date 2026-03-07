import React, { useState } from 'react';
import {
  LayoutDashboard, Users, GraduationCap, Building2, Calendar, Settings,
  LogOut, User, Search, Bell, FileText, BarChart3, ListTodo, Sun, Moon,
  ScrollText, ShieldCheck, Plus, Trash2, Edit3, X, Save, ChevronDown,
  BookOpen, UserCheck, Layers, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
      active ? 'text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400'
             : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}>
    <div className={active ? 'text-violet-600 dark:text-violet-400' : 'text-violet-500 dark:text-violet-400'}>{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);
const SidebarSection = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="px-4 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{title}</h3>
    <div className="flex flex-col">{children}</div>
  </div>
);

// ─── Couleurs par département ─────────────────────────────────────────────────
const DEPT_COLORS = [
  { bg: 'bg-violet-500', light: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-700 dark:text-violet-300', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { bg: 'bg-blue-500',   light: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-200 dark:border-blue-800',     text: 'text-blue-700 dark:text-blue-300',     badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'     },
  { bg: 'bg-emerald-500',light: 'bg-emerald-50 dark:bg-emerald-900/20',border:'border-emerald-200 dark:border-emerald-800',text: 'text-emerald-700 dark:text-emerald-300',badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'},
  { bg: 'bg-amber-500',  light: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-800',   text: 'text-amber-700 dark:text-amber-300',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'  },
  { bg: 'bg-red-500',    light: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800',       text: 'text-red-700 dark:text-red-300',       badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'          },
  { bg: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'},
];

const INITIAL_DEPARTEMENTS = [
  { id:'1', code:'INFO', nom:'Informatique',          chef:'Dr. Ahmed Ben Ali',   email:'info@isims.tn',      telephone:'+216 73 111 001', nbEnseignants:12, nbMatieres:18, description:'Département des sciences informatiques et des technologies logicielles.' },
  { id:'2', code:'MATH', nom:'Mathématiques',         chef:'Mme. Sara Chaabane',  email:'math@isims.tn',      telephone:'+216 73 111 002', nbEnseignants:8,  nbMatieres:10, description:'Département des mathématiques appliquées et fondamentales.'              },
  { id:'3', code:'LANG', nom:'Langues',               chef:'Mr. Tarek Mansouri',  email:'lang@isims.tn',      telephone:'+216 73 111 003', nbEnseignants:6,  nbMatieres:6,  description:'Département des langues étrangères et de la communication.'              },
  { id:'4', code:'PHYS', nom:'Physique',              chef:'Dr. Omar Hajji',      email:'phys@isims.tn',      telephone:'+216 73 111 004', nbEnseignants:7,  nbMatieres:8,  description:'Département de physique générale et d\'électronique.'                    },
  { id:'5', code:'ECO',  nom:'Économie & Gestion',   chef:'Mme. Amira Trabelsi', email:'eco@isims.tn',       telephone:'+216 73 111 005', nbEnseignants:9,  nbMatieres:12, description:'Département des sciences économiques et de gestion.'                     },
  { id:'6', code:'COMM', nom:'Communication',         chef:'Mr. Bilel Dridi',     email:'comm@isims.tn',      telephone:'+216 73 111 006', nbEnseignants:5,  nbMatieres:7,  description:'Département communication et multimédia.'                                },
];

// ─── Modal Département ────────────────────────────────────────────────────────
function DepartementModal({ dept, colorIdx, onClose, onSave }) {
  const isEdit = !!dept?.id;
  const [form, setForm] = useState(dept || { code:'', nom:'', chef:'', email:'', telephone:'', nbEnseignants:0, nbMatieres:0, description:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.code || !form.nom) return alert('Code et nom requis.');
    onSave({ ...form, id: form.id || Date.now().toString() });
  };

  const color = DEPT_COLORS[colorIdx % DEPT_COLORS.length];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700">
        <div className={`${color.bg} p-5 rounded-t-2xl flex items-center justify-between`}>
          <div className="flex items-center gap-2 text-white">
            <Building2 size={18} />
            <h2 className="font-black text-base">{isEdit ? 'Modifier département' : 'Nouveau département'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label-d">Code</label>
              <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} className="input-d" placeholder="INFO" maxLength={6} />
            </div>
            <div className="col-span-2">
              <label className="label-d">Nom du département</label>
              <input value={form.nom} onChange={e => set('nom', e.target.value)} className="input-d" placeholder="Informatique" />
            </div>
          </div>
          <div>
            <label className="label-d">Chef de département</label>
            <div className="relative">
              <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.chef} onChange={e => set('chef', e.target.value)} className="input-d pl-8" placeholder="Dr. Nom Prénom" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-d">Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} className="input-d" placeholder="dept@isims.tn" />
            </div>
            <div>
              <label className="label-d">Téléphone</label>
              <input value={form.telephone} onChange={e => set('telephone', e.target.value)} className="input-d" placeholder="+216 73 xxx xxx" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-d">Nb. enseignants</label>
              <input type="number" value={form.nbEnseignants} onChange={e => set('nbEnseignants', parseInt(e.target.value)||0)} className="input-d" min="0" />
            </div>
            <div>
              <label className="label-d">Nb. matières</label>
              <input type="number" value={form.nbMatieres} onChange={e => set('nbMatieres', parseInt(e.target.value)||0)} className="input-d" min="0" />
            </div>
          </div>
          <div>
            <label className="label-d">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input-d resize-none h-20" placeholder="Description du département..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800">Annuler</button>
            <button onClick={handleSave} className={`flex-1 py-2.5 rounded-xl ${color.bg} text-white text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2`}>
              <Save size={14} /> {isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dept Card ────────────────────────────────────────────────────────────────
function DeptCard({ dept, colorIdx, onEdit, onDelete, expanded, onToggle }) {
  const color = DEPT_COLORS[colorIdx % DEPT_COLORS.length];
  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl border ${color.border} shadow-sm overflow-hidden transition-all`}>
      {/* Top stripe */}
      <div className={`h-1.5 ${color.bg} w-full`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${color.bg} flex items-center justify-center shadow`}>
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-neutral-900 dark:text-white text-sm">{dept.nom}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${color.badge}`}>{dept.code}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">👤 {dept.chef}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(dept, colorIdx)}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              <Edit3 size={14} />
            </button>
            <button onClick={() => onDelete(dept.id)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-neutral-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`${color.light} rounded-xl p-2.5 text-center border ${color.border}`}>
            <p className="text-[10px] font-black text-neutral-400 uppercase">Enseignants</p>
            <p className={`text-xl font-black ${color.text}`}>{dept.nbEnseignants}</p>
          </div>
          <div className={`${color.light} rounded-xl p-2.5 text-center border ${color.border}`}>
            <p className="text-[10px] font-black text-neutral-400 uppercase">Matières</p>
            <p className={`text-xl font-black ${color.text}`}>{dept.nbMatieres}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1 mb-3">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-300">✉</span> {dept.email}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-300">📞</span> {dept.telephone}
          </p>
        </div>

        {/* Toggle description */}
        <button onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${color.light} ${color.text} border ${color.border}`}>
          <span>Description</span>
          <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className={`mt-2 p-3 rounded-xl ${color.light} border ${color.border}`}>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{dept.description || '—'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Departements() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userName] = useState(localStorage.getItem('userName') || 'Administrateur');
  const [depts, setDepts] = useState(() => JSON.parse(localStorage.getItem('departements') || 'null') || INITIAL_DEPARTEMENTS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expanded, setExpanded] = useState({});

  const save = (data) => { setDepts(data); localStorage.setItem('departements', JSON.stringify(data)); };
  const handleLogout = () => { localStorage.removeItem('userName'); localStorage.removeItem('userRole'); navigate('/login'); };

  const filtered = depts.filter(d =>
    !search || d.nom.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase()) || d.chef.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (dept) => {
    const exists = depts.find(d => d.id === dept.id);
    save(exists ? depts.map(d => d.id === dept.id ? dept : d) : [...depts, dept]);
    setModal(null);
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const totalEnseignants = depts.reduce((s, d) => s + (d.nbEnseignants || 0), 0);
  const totalMatieres    = depts.reduce((s, d) => s + (d.nbMatieres || 0), 0);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-white dark:bg-neutral-950">
        <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
          <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xl font-bold text-violet-600">ISIMS Admin</span>
          </div>
          <div className="flex-grow overflow-y-auto py-4">
            <SidebarSection title="ADMINISTRATION">
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" onClick={() => navigate('/admin')} />
              <SidebarItem icon={<Users size={18} />} label="Utilisateurs" onClick={() => navigate('/admin/utilisateurs')} />
              <SidebarItem icon={<GraduationCap size={18} />} label="Étudiants" onClick={() => navigate('/admin/etudiants')} />
              <SidebarItem icon={<Building2 size={18} />} label="Départements" active />
            </SidebarSection>
            <SidebarSection title="ACADÉMIQUE">
              <SidebarItem icon={<Calendar size={18} />} label="Emplois du temps" onClick={() => navigate('/admin/schedules')} />
              <SidebarItem icon={<ListTodo size={18} />} label="Questionnaires" onClick={() => navigate('/admin/questionnaires')} />
              <SidebarItem icon={<FileText size={18} />} label="Examens" />
              <SidebarItem icon={<BarChart3 size={18} />} label="Statistiques" />
            </SidebarSection>
            <SidebarSection title="SYSTÈME">
              <SidebarItem icon={<ScrollText size={18} />} label="Logs" />
              <SidebarItem icon={<ShieldCheck size={18} />} label="Sécurité" />
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
              <input type="text" placeholder="Rechercher un département..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm px-2 w-52 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400" />
              <Search size={16} className="text-neutral-400" />
            </div>
            <div className="flex items-center gap-6">
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="relative text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-violet-600">
                <Bell size={18} />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 font-bold border border-violet-200">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{userName}</span>
              </div>
            </div>
          </header>

          <main className="p-6 bg-neutral-50 dark:bg-neutral-950 flex-grow overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Départements</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Structure académique de l'établissement.</p>
              </div>
              <button onClick={() => setModal({ mode: 'add', colorIdx: depts.length })}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus size={16} /> Nouveau département
              </button>
            </div>

            {/* Stats globales */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Départements', value: depts.length,     icon: <Building2 size={16} />, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                { label: 'Enseignants',  value: totalEnseignants, icon: <Users size={16} />,     color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20'       },
                { label: 'Matières',     value: totalMatieres,    icon: <BookOpen size={16} />,  color: 'text-emerald-600',bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`${s.color} opacity-40`}>{s.icon}</div>
                </div>
              ))}
            </div>

            {/* Grille cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((dept, idx) => (
                <DeptCard
                  key={dept.id}
                  dept={dept}
                  colorIdx={idx}
                  onEdit={(d, ci) => setModal({ mode: 'edit', dept: d, colorIdx: ci })}
                  onDelete={setConfirmDelete}
                  expanded={!!expanded[dept.id]}
                  onToggle={() => toggleExpand(dept.id)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-16 text-neutral-400">
                  <Building2 size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Aucun département trouvé</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {modal && (
        <DepartementModal
          dept={modal.mode === 'edit' ? modal.dept : null}
          colorIdx={modal.colorIdx || 0}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-black text-neutral-900 dark:text-white mb-2">Supprimer ce département ?</h3>
            <p className="text-sm text-neutral-500 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600">Annuler</button>
              <button onClick={() => { save(depts.filter(d => d.id !== confirmDelete)); setConfirmDelete(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .label-d { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.05em; margin-bottom:5px; }
        .input-d { width:100%; padding:8px 12px; border-radius:10px; border:1.5px solid #e5e7eb; font-size:13px; outline:none; background:white; color:#111; }
        .input-d:focus { border-color:#7c3aed; }
        .dark .input-d { background:#171717; border-color:#404040; color:#f5f5f5; }
        .dark .input-d:focus { border-color:#7c3aed; }
      `}</style>
    </div>
  );
}