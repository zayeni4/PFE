import React, { useState } from 'react';
import {
  LayoutDashboard, Users, GraduationCap, Building2, Calendar, Settings,
  LogOut, User, Search, Bell, FileText, BarChart3, ListTodo, Sun, Moon,
  ScrollText, ShieldCheck, Plus, Trash2, Edit3, X, Save, Filter,
  Mail, Phone, BookOpen, Hash, Download, Upload
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

const LICENCES = ['L1', 'L2', 'L3', 'M1', 'M2'];
const GROUPES  = { L1: ['L1-A','L1-B','L1-C'], L2: ['L2-A','L2-B','L2-C'], L3: ['L3-A','L3-B'], M1: ['M1-SI','M1-DS'], M2: ['M2-SI','M2-DS'] };
const STATUTS_ETU = ['inscrit', 'diplômé', 'abandon'];

const statutEtuStyle = (s) => ({
  inscrit:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  diplômé:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  abandon:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}[s] || 'bg-neutral-100 text-neutral-500');

const INITIAL_ETUDIANTS = [
  { id:'1', matricule:'2024001', nom:'Amri',     prenom:'Sana',    email:'sana.amri@etud.isims.tn',     telephone:'+216 22 001 001', licence:'L1', groupe:'L1-A', statut:'inscrit',  annee:'2024-2025' },
  { id:'2', matricule:'2024002', nom:'Bel Haj',  prenom:'Youssef', email:'youssef.bh@etud.isims.tn',   telephone:'+216 55 002 002', licence:'L1', groupe:'L1-B', statut:'inscrit',  annee:'2024-2025' },
  { id:'3', matricule:'2023001', nom:'Chebbi',   prenom:'Mariem',  email:'mariem.chebbi@etud.isims.tn', telephone:'+216 98 003 003', licence:'L2', groupe:'L2-A', statut:'inscrit',  annee:'2024-2025' },
  { id:'4', matricule:'2023002', nom:'Dali',     prenom:'Firas',   email:'firas.dali@etud.isims.tn',   telephone:'+216 77 004 004', licence:'L2', groupe:'L2-B', statut:'inscrit',  annee:'2024-2025' },
  { id:'5', matricule:'2022001', nom:'Elloumi',  prenom:'Nadia',   email:'nadia.elloumi@etud.isims.tn', telephone:'+216 44 005 005', licence:'L3', groupe:'L3-A', statut:'inscrit',  annee:'2024-2025' },
  { id:'6', matricule:'2021001', nom:'Ferchichi',prenom:'Bilel',   email:'bilel.f@etud.isims.tn',       telephone:'+216 21 006 006', licence:'M1', groupe:'M1-SI',statut:'inscrit',  annee:'2024-2025' },
  { id:'7', matricule:'2020001', nom:'Garrach',  prenom:'Hana',    email:'hana.garrach@etud.isims.tn', telephone:'+216 99 007 007', licence:'M2', groupe:'M2-DS',statut:'diplômé',  annee:'2023-2024' },
  { id:'8', matricule:'2024003', nom:'Haddad',   prenom:'Zied',    email:'zied.haddad@etud.isims.tn',  telephone:'+216 33 008 008', licence:'L1', groupe:'L1-C', statut:'abandon',  annee:'2024-2025' },
];

function EtudiantModal({ etudiant, onClose, onSave }) {
  const isEdit = !!etudiant?.id;
  const [form, setForm] = useState(etudiant || { matricule:'', nom:'', prenom:'', email:'', telephone:'', licence:'L1', groupe:'L1-A', statut:'inscrit', annee:'2024-2025' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const groupes = GROUPES[form.licence] || [];

  const handleSave = () => {
    if (!form.matricule || !form.nom || !form.prenom || !form.email) return alert('Champs obligatoires manquants.');
    onSave({ ...form, id: form.id || Date.now().toString() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap size={18} />
            <h2 className="font-black text-base">{isEdit ? 'Modifier étudiant' : 'Nouvel étudiant'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label-e">Matricule</label>
            <div className="relative">
              <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.matricule} onChange={e => set('matricule', e.target.value)} className="input-e pl-8" placeholder="2024001" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-e">Nom</label>
              <input value={form.nom} onChange={e => set('nom', e.target.value)} className="input-e" placeholder="Amri" />
            </div>
            <div>
              <label className="label-e">Prénom</label>
              <input value={form.prenom} onChange={e => set('prenom', e.target.value)} className="input-e" placeholder="Sana" />
            </div>
          </div>
          <div>
            <label className="label-e">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.email} onChange={e => set('email', e.target.value)} className="input-e pl-8" placeholder="prenom.nom@etud.isims.tn" />
            </div>
          </div>
          <div>
            <label className="label-e">Téléphone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={form.telephone} onChange={e => set('telephone', e.target.value)} className="input-e pl-8" placeholder="+216 xx xxx xxx" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-e">Licence / Niveau</label>
              <select value={form.licence} onChange={e => { set('licence', e.target.value); set('groupe', GROUPES[e.target.value]?.[0] || ''); }} className="input-e">
                {LICENCES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label-e">Groupe</label>
              <select value={form.groupe} onChange={e => set('groupe', e.target.value)} className="input-e">
                {groupes.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-e">Statut</label>
              <select value={form.statut} onChange={e => set('statut', e.target.value)} className="input-e">
                {STATUTS_ETU.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-e">Année universitaire</label>
              <input value={form.annee} onChange={e => set('annee', e.target.value)} className="input-e" placeholder="2024-2025" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800">Annuler</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
              <Save size={14} /> {isEdit ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Etudiants() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userName] = useState(localStorage.getItem('userName') || 'Administrateur');
  const [etudiants, setEtudiants] = useState(() => JSON.parse(localStorage.getItem('etudiants') || 'null') || INITIAL_ETUDIANTS);
  const [search, setSearch] = useState('');
  const [filterLicence, setFilterLicence] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const save = (data) => { setEtudiants(data); localStorage.setItem('etudiants', JSON.stringify(data)); };
  const handleLogout = () => { localStorage.removeItem('userName'); localStorage.removeItem('userRole'); navigate('/login'); };

  const filtered = etudiants.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q) || e.matricule.includes(q) || e.email.toLowerCase().includes(q);
    return matchQ && (!filterLicence || e.licence === filterLicence) && (!filterStatut || e.statut === filterStatut);
  });

  const handleSave = (etu) => {
    const exists = etudiants.find(e => e.id === etu.id);
    save(exists ? etudiants.map(e => e.id === etu.id ? etu : e) : [...etudiants, etu]);
    setModal(null);
  };

  const stats = {
    total: etudiants.length,
    inscrits: etudiants.filter(e => e.statut === 'inscrit').length,
    ...Object.fromEntries(LICENCES.map(l => [l, etudiants.filter(e => e.licence === l).length])),
  };

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
              <SidebarItem icon={<GraduationCap size={18} />} label="Étudiants" active />
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

        <div className="flex-grow flex flex-col">
          <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-900">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1">
              <input type="text" placeholder="Rechercher par nom, matricule..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm px-2 w-56 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400" />
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
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Étudiants</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Gestion des inscriptions et des groupes.</p>
              </div>
              <div className="flex gap-2">
                <button className="border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <Upload size={15} /> Importer
                </button>
                <button onClick={() => setModal({ mode: 'add' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Plus size={16} /> Ajouter étudiant
                </button>
              </div>
            </div>

            {/* Stats par niveau */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800 col-span-2">
                <p className="text-[10px] font-black text-neutral-400 uppercase">Total inscrits</p>
                <p className="text-2xl font-black text-blue-600">{stats.inscrits}</p>
              </div>
              {LICENCES.map(l => (
                <div key={l} className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-[10px] font-black text-neutral-400 uppercase">{l}</p>
                  <p className="text-xl font-black text-neutral-900 dark:text-white">{stats[l] || 0}</p>
                </div>
              ))}
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1"><Filter size={12} /> Niveau :</span>
              {['', ...LICENCES].map(l => (
                <button key={l} onClick={() => setFilterLicence(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterLicence === l ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-blue-300'}`}>
                  {l || 'Tous'}
                </button>
              ))}
              <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700" />
              <span className="text-xs font-bold text-neutral-400">Statut :</span>
              {['', ...STATUTS_ETU].map(s => (
                <button key={s} onClick={() => setFilterStatut(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatut === s ? 'bg-blue-600 text-white border-blue-600' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-blue-300'}`}>
                  {s || 'Tous'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    {['Matricule', 'Étudiant', 'Email', 'Téléphone', 'Niveau', 'Groupe', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-12 text-neutral-400 text-sm">Aucun étudiant trouvé</td></tr>
                  )}
                  {filtered.map(e => (
                    <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg">{e.matricule}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-200 dark:border-blue-700">
                            {e.prenom.charAt(0)}{e.nom.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{e.prenom} {e.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{e.email}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{e.telephone}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">{e.licence}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{e.groupe}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statutEtuStyle(e.statut)}`}>{e.statut}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setModal({ mode: 'edit', etudiant: e })}
                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-neutral-400 hover:text-blue-600">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => setConfirmDelete(e.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-neutral-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                {filtered.length} étudiant{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
              </div>
            </div>
          </main>
        </div>
      </div>

      {modal && (
        <EtudiantModal
          etudiant={modal.mode === 'edit' ? modal.etudiant : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-black text-neutral-900 dark:text-white mb-2">Supprimer cet étudiant ?</h3>
            <p className="text-sm text-neutral-500 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-neutral-600">Annuler</button>
              <button onClick={() => { save(etudiants.filter(e => e.id !== confirmDelete)); setConfirmDelete(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .label-e { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.05em; margin-bottom:5px; }
        .input-e { width:100%; padding:8px 12px; border-radius:10px; border:1.5px solid #e5e7eb; font-size:13px; outline:none; background:white; color:#111; }
        .input-e:focus { border-color:#2563eb; }
        .dark .input-e { background:#171717; border-color:#404040; color:#f5f5f5; }
        .dark .input-e:focus { border-color:#2563eb; }
      `}</style>
    </div>
  );
}