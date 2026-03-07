import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, GraduationCap, Building2, Calendar, Settings,
  LogOut, User, Search, Bell, FileText, BarChart3, ListTodo, Sun, Moon,
  ScrollText, ShieldCheck, Plus, Trash2, Edit3, Eye, EyeOff, X, Save,
  Filter, ChevronDown, Check, Shield, UserCheck, UserX, MoreVertical,
  Key, Mail, Phone, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// ─── Sidebar (identique au Dashboard) ────────────────────────────────────────
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
      active
        ? 'text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400'
        : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
    }`}>
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

// ─── Données mock ─────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: '1', nom: 'Ben Ali',    prenom: 'Ahmed',   email: 'ahmed.benali@isims.tn',   role: 'admin',      statut: 'actif',    telephone: '+216 22 111 000', dateCreation: '2024-09-01' },
  { id: '2', nom: 'Chaabane',   prenom: 'Leila',   email: 'leila.chaabane@isims.tn', role: 'enseignant', statut: 'actif',    telephone: '+216 98 222 111', dateCreation: '2024-09-05' },
  { id: '3', nom: 'Mansouri',   prenom: 'Karim',   email: 'karim.mansouri@isims.tn', role: 'enseignant', statut: 'actif',    telephone: '+216 55 333 222', dateCreation: '2024-09-10' },
  { id: '4', nom: 'Trabelsi',   prenom: 'Sara',    email: 'sara.trabelsi@isims.tn',  role: 'scolarite',  statut: 'actif',    telephone: '+216 77 444 333', dateCreation: '2024-10-01' },
  { id: '5', nom: 'Hajji',      prenom: 'Omar',    email: 'omar.hajji@isims.tn',     role: 'enseignant', statut: 'inactif',  telephone: '+216 44 555 444', dateCreation: '2024-10-15' },
  { id: '6', nom: 'Boughanmi',  prenom: 'Amira',   email: 'amira.b@isims.tn',        role: 'scolarite',  statut: 'actif',    telephone: '+216 99 666 555', dateCreation: '2024-11-01' },
  { id: '7', nom: 'Dridi',      prenom: 'Tarek',   email: 'tarek.dridi@isims.tn',    role: 'enseignant', statut: 'suspendu', telephone: '+216 21 777 666', dateCreation: '2025-01-10' },
];

const ROLES = ['admin', 'enseignant', 'scolarite'];
const STATUTS = ['actif', 'inactif', 'suspendu'];

const roleStyle = (r) => ({
  admin:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  enseignant: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  scolarite:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}[r] || 'bg-neutral-100 text-neutral-600');

const statutStyle = (s) => ({
  actif:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  inactif:  'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
  suspendu: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}[s] || '');

const statutDot = (s) => ({ actif: 'bg-emerald-500', inactif: 'bg-neutral-400', suspendu: 'bg-red-500' }[s] || 'bg-neutral-400');

// ─── Modal Utilisateur ────────────────────────────────────────────────────────
function UserModal({ user, onClose, onSave }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState(user || { nom: '', prenom: '', email: '', telephone: '', role: 'enseignant', statut: 'actif' });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.nom || !form.prenom || !form.email) return alert('Nom, prénom et email requis.');
    onSave({ ...form, id: form.id || Date.now().toString(), dateCreation: form.dateCreation || new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <User size={18} />
            <h2 className="font-black text-base">{isEdit ? 'Modifier utilisateur' : 'Nouvel utilisateur'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-u">Nom</label>
              <input value={form.nom} onChange={e => set('nom', e.target.value)} className="input-u" placeholder="Ben Ali" />
            </div>
            <div>
              <label className="label-u">Prénom</label>
              <input value={form.prenom} onChange={e => set('prenom', e.target.value)} className="input-u" placeholder="Ahmed" />
            </div>
          </div>
          <div>
            <label className="label-u">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.email} onChange={e => set('email', e.target.value)} className="input-u pl-8" placeholder="email@isims.tn" />
            </div>
          </div>
          <div>
            <label className="label-u">Téléphone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.telephone} onChange={e => set('telephone', e.target.value)} className="input-u pl-8" placeholder="+216 xx xxx xxx" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-u">Rôle</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} className="input-u">
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label-u">Statut</label>
              <select value={form.statut} onChange={e => set('statut', e.target.value)} className="input-u">
                {STATUTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          {!isEdit && (
            <div>
              <label className="label-u">Mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)}
                  className="input-u pl-8 pr-10" placeholder="Mot de passe temporaire" />
                <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800">Annuler</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 flex items-center justify-center gap-2">
              <Save size={14} /> {isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Utilisateurs() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userName] = useState(localStorage.getItem('userName') || 'Administrateur');
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users') || 'null') || INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [modal, setModal] = useState(null); // null | {mode:'add'} | {mode:'edit', user}
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const save = (data) => { setUsers(data); localStorage.setItem('users', JSON.stringify(data)); };

  const handleLogout = () => { localStorage.removeItem('userName'); localStorage.removeItem('userRole'); navigate('/login'); };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.nom.toLowerCase().includes(q) || u.prenom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = !filterRole || u.role === filterRole;
    const matchS = !filterStatut || u.statut === filterStatut;
    return matchQ && matchR && matchS;
  });

  const handleSave = (user) => {
    const exists = users.find(u => u.id === user.id);
    save(exists ? users.map(u => u.id === user.id ? user : u) : [...users, user]);
    setModal(null);
  };

  const handleDelete = (id) => { save(users.filter(u => u.id !== id)); setConfirmDelete(null); };

  const toggleStatut = (id) => {
    save(users.map(u => u.id === id ? { ...u, statut: u.statut === 'actif' ? 'suspendu' : 'actif' } : u));
    setOpenMenu(null);
  };

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    admins: users.filter(u => u.role === 'admin').length,
    enseignants: users.filter(u => u.role === 'enseignant').length,
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-white dark:bg-neutral-950">
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
          <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xl font-bold text-violet-600">ISIMS Admin</span>
          </div>
          <div className="flex-grow overflow-y-auto py-4">
            <SidebarSection title="ADMINISTRATION">
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Tableau de bord" onClick={() => navigate('/admin')} />
              <SidebarItem icon={<Users size={18} />} label="Utilisateurs" active />
              <SidebarItem icon={<GraduationCap size={18} />} label="Étudiants" onClick={() => navigate('/admin/etudiants')} />
              <SidebarItem icon={<Building2 size={18} />} label="Départements" onClick={() => navigate('/admin/departements')} />
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

        {/* Main */}
        <div className="flex-grow flex flex-col">
          {/* Topbar */}
          <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-900">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1">
              <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm px-2 w-48 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400" />
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
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 font-bold border border-violet-200 dark:border-violet-700">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{userName}</span>
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="p-6 bg-neutral-50 dark:bg-neutral-950 flex-grow overflow-auto">
            {/* Header page */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Utilisateurs</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Gestion des comptes administrateurs et enseignants.</p>
              </div>
              <button onClick={() => setModal({ mode: 'add' })}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                <Plus size={16} /> Nouvel utilisateur
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total',       value: stats.total,       color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                { label: 'Actifs',      value: stats.actifs,      color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'Admins',      value: stats.admins,      color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                { label: 'Enseignants', value: stats.enseignants, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-4 border border-neutral-200 dark:border-neutral-800`}>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-bold">
                <Filter size={13} /> Filtres :
              </div>
              {['', ...ROLES].map(r => (
                <button key={r} onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterRole === r ? 'bg-violet-600 text-white border-violet-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-violet-300'}`}>
                  {r || 'Tous les rôles'}
                </button>
              ))}
              <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-1" />
              {['', ...STATUTS].map(s => (
                <button key={s} onClick={() => setFilterStatut(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatut === s ? 'bg-violet-600 text-white border-violet-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-violet-300'}`}>
                  {s || 'Tous statuts'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    {['Utilisateur', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Création', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-neutral-400">Aucun utilisateur trouvé</td></tr>
                  )}
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-black text-sm border border-violet-200 dark:border-violet-700">
                            {u.prenom.charAt(0)}{u.nom.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">{u.prenom} {u.nom}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{u.telephone}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${roleStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${statutDot(u.statut)}`}></span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statutStyle(u.statut)}`}>{u.statut}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-400">{u.dateCreation}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setModal({ mode: 'edit', user: u })}
                            className="p-1.5 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg text-neutral-400 hover:text-violet-600 transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => toggleStatut(u.id)}
                            className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-neutral-400 hover:text-amber-600 transition-colors"
                            title={u.statut === 'actif' ? 'Suspendre' : 'Activer'}>
                            {u.statut === 'actif' ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button onClick={() => setConfirmDelete(u.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-neutral-400 hover:text-red-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <UserModal
          user={modal.mode === 'edit' ? modal.user : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-black text-neutral-900 dark:text-white mb-2">Supprimer cet utilisateur ?</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600 dark:text-neutral-400">Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .label-u { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.05em; margin-bottom:5px; }
        .input-u { width:100%; padding:8px 12px; border-radius:10px; border:1.5px solid #e5e7eb; font-size:13px; outline:none; background:white; color:#111; transition:border-color .15s; }
        .input-u:focus { border-color:#7c3aed; }
        .dark .input-u { background:#171717; border-color:#404040; color:#f5f5f5; }
        .dark .input-u:focus { border-color:#7c3aed; }
      `}</style>
    </div>
  );
}