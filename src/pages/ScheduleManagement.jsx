import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronDown, ChevronRight, Check, Plus, Trash2,
  BookOpen, Users, MapPin, GraduationCap, Clock,
  Save, X, AlertCircle, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const TIME_SLOTS = [
  '08:00 – 09:30', '09:45 – 11:15', '11:30 – 13:00',
  '13:00 – 14:30', '14:30 – 16:00', '16:15 – 17:45',
];

// Génère les années universitaires (5 ans autour de maintenant)
const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push({ value: `${y}-${y + 1}`, label: `${y} – ${y + 1}` });
  }
  return years;
};
const ACADEMIC_YEARS = generateAcademicYears();

// Détecte l'année universitaire depuis une date
// L'année univ commence en septembre : mars 2026 → "2025-2026"
const getAcademicYearFromDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const month = d.getMonth(); // 0=Jan … 8=Sep
  const year  = d.getFullYear();
  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

const getCurrentAcademicYear = () => getAcademicYearFromDate(new Date().toISOString());

const LICENCES = [
  { value: 'L1', label: 'Licence 1', classes: ['L1-A', 'L1-B', 'L1-C'] },
  { value: 'L2', label: 'Licence 2', classes: ['L2-A', 'L2-B', 'L2-C'] },
  { value: 'L3', label: 'Licence 3', classes: ['L3-A', 'L3-B'] },
  { value: 'M1', label: 'Master 1',  classes: ['M1-SI', 'M1-DS'] },
  { value: 'M2', label: 'Master 2',  classes: ['M2-SI', 'M2-DS'] },
];

const SALLES = [
  'Amphi A', 'Amphi B',
  'Salle 101', 'Salle 102', 'Salle 103', 'Salle 104',
  'Salle 201', 'Salle 202', 'Salle 203',
  'Labo Info 1', 'Labo Info 2', 'Labo Réseau',
  'TD 01', 'TD 02', 'TD 03', 'TD 04',
];

const DEPARTEMENTS = [
  { value: 'info',    label: 'Informatique',   matieres: ['Algorithmique', 'Programmation C', 'Développement Web', 'Base de Données', "Systèmes d'Exploitation", 'Architecture', 'Réseaux', 'Intelligence Artificielle'], teachers: ['Dr. Ahmed', 'Mr. Karim', 'Dr. Leila'] },
  { value: 'math',    label: 'Mathématiques',  matieres: ['Analyse', 'Algèbre', 'Probabilités', 'Statistiques'],                                                                                                          teachers: ['Mme. Sarah', 'Dr. Omar'] },
  { value: 'langue',  label: 'Langues',         matieres: ['Anglais Technique', 'Français', 'Communication'],                                                                                                              teachers: ['Mr. Tarek', 'Mme. Amira'] },
  { value: 'physique',label: 'Physique',        matieres: ['Physique Générale', 'Électronique', 'Optique'],                                                                                                                teachers: ['Dr. Slim', 'Mr. Fares'] },
];

const TYPE_COURS = [
  { value: 'cours',  label: 'Cours',  color: 'bg-blue-100 border-blue-300 text-blue-800',         dot: 'bg-blue-500'    },
  { value: 'td',     label: 'TD',     color: 'bg-emerald-100 border-emerald-300 text-emerald-800', dot: 'bg-emerald-500' },
  { value: 'tp',     label: 'TP',     color: 'bg-violet-100 border-violet-300 text-violet-800',    dot: 'bg-violet-500'  },
  { value: 'exam',   label: 'Examen', color: 'bg-red-100 border-red-300 text-red-800',             dot: 'bg-red-500'     },
  { value: 'projet', label: 'Projet', color: 'bg-amber-100 border-amber-300 text-amber-800',       dot: 'bg-amber-500'   },
];

const getTypeStyle = (type) => TYPE_COURS.find(t => t.value === type) || TYPE_COURS[0];

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium bg-white transition-all ${open ? 'border-blue-500 shadow-md shadow-blue-100' : 'border-neutral-200 hover:border-blue-300'}`}>
        <span className={selected ? 'text-neutral-800' : 'text-neutral-400'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map(opt => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-neutral-700 hover:bg-neutral-50 font-medium'}`}>
                  {opt.label}
                  {value === opt.value && <Check size={13} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ADD SEANCE MODAL ─────────────────────────────────────────────────────────
function AddSeanceModal({ onClose, onSave, editData, filterLicence, filterClasse, filterDept, filterMatiere, existingExams }) {
  const [day,           setDay]      = useState(editData?.day      || DAYS[0]);
  const [slot,          setSlot]     = useState(editData?.slot     || TIME_SLOTS[0]);
  const [type,          setType]     = useState(editData?.type     || 'cours');
  const [matiere,       setMatiere]  = useState(editData?.matiere  || filterMatiere || '');
  const [salle,         setSalle]    = useState(editData?.salle    || '');
  const [dept,          setDept]     = useState(editData?.dept     || filterDept || 'info');
  const [teacher,       setTeacher]  = useState(editData?.teacher  || '');
  const [licence,       setLicence]  = useState(editData?.licence  || filterLicence || '');
  const [classe,        setClasse]   = useState(editData?.classe   || filterClasse || '');
  const [examDateStart, setExamDateStart] = useState(editData?.examDateStart || '');
  const [examDateEnd,   setExamDateEnd]   = useState(editData?.examDateEnd   || '');
  const [academicYear,  setAcademicYear]  = useState(editData?.academicYear  || getCurrentAcademicYear());

  // ── Créneaux libres de l'examen : [{id, date, matiere, dept, heureDebut, heureFin, salle}]
  const [creneaux, setCreneaux] = useState(
    editData?.creneaux?.length ? editData.creneaux : []
  );

  const isExam = type === 'exam';
  const currentDept = DEPARTEMENTS.find(d => d.value === dept);
  const currentLic  = LICENCES.find(l => l.value === licence);

  // Auto-détection année depuis date début
  const handleDateStartChange = (val) => {
    setExamDateStart(val);
    if (val) { const y = getAcademicYearFromDate(val); if (y) setAcademicYear(y); }
  };

  // Doublon
  const isDuplicate = isExam && matiere && classe && (existingExams || []).some(e =>
    e.id !== editData?.id && e.matiere === matiere && e.licence === licence && e.classe === classe
  );

  // ── Gestion créneaux libres ──
  const addCreneau = () => {
    setCreneaux(prev => [...prev, {
      id: Date.now().toString(),
      date: examDateStart || '',
      dept: dept || 'info',
      matiere: '',
      heureDebut: '08:00',
      heureFin: '10:00',
      salle: salle || '',
    }]);
  };

  const updateCreneau = (id, field, val) => {
    setCreneaux(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, [field]: val };
      // Si le dept change, reset matière
      if (field === 'dept') updated.matiere = '';
      return updated;
    }));
  };

  const removeCreneau = (id) => setCreneaux(prev => prev.filter(c => c.id !== id));

  const handleSave = () => {
    if (!licence || !classe) return alert('Choisissez une licence et une classe.');
    if (isExam) {
      if (!examDateStart) return alert('Date de début requise.');
      if (!examDateEnd)   return alert('Date de fin requise.');
      if (examDateEnd < examDateStart) return alert('La date de fin doit être après le début.');
      if (!academicYear) return alert('Année universitaire requise.');
      if (creneaux.length === 0) return alert('Ajoutez au moins un créneau d\'examen.');
      for (const c of creneaux) {
        if (!c.matiere) return alert('Choisissez une matière pour chaque créneau.');
        if (!c.date)    return alert('Choisissez une date pour chaque créneau.');
        if (!c.heureDebut || !c.heureFin) return alert('Renseignez les heures pour chaque créneau.');
      }
    } else {
      if (!matiere) return alert('Choisissez une matière.');
      if (!salle)   return alert('Choisissez une salle.');
    }

    onSave({
      id: editData?.id || Date.now().toString(),
      day, slot, type, matiere, salle, dept, teacher, licence, classe,
      ...(isExam ? { examDateStart, examDateEnd, academicYear, creneaux } : {}),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className={`p-6 text-white sticky top-0 rounded-t-3xl z-10 ${isExam ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <h2 className="font-black text-lg">{editData ? 'Modifier' : isExam ? 'Planifier un examen' : 'Nouvelle séance'}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Type */}
          <div>
            <label className="label-field">📌 Type de séance</label>
            <div className="flex flex-wrap gap-2">
              {TYPE_COURS.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${type === t.value ? t.color + ' scale-105' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}>
                  <span className={`w-2 h-2 rounded-full ${t.dot}`}></span>{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ══ BLOC EXAMEN ══ */}
          <AnimatePresence>
            {isExam && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden">

                {/* Année + Période */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center"><FileText size={13} className="text-white" /></div>
                    <p className="text-xs font-black text-red-700 uppercase tracking-widest">Période de la session</p>
                  </div>

                  <div>
                    <label className="label-field text-red-600">🎓 Année universitaire</label>
                    <CustomSelect value={academicYear} onChange={setAcademicYear} placeholder="Choisir l'année" options={ACADEMIC_YEARS} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label-field text-red-600">📅 Date de début</label>
                      <input type="date" value={examDateStart} onChange={e => handleDateStartChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-red-200 text-sm font-medium focus:border-red-400 outline-none bg-white" />
                    </div>
                    <div>
                      <label className="label-field text-red-600">📅 Date de fin</label>
                      <input type="date" value={examDateEnd} min={examDateStart} onChange={e => setExamDateEnd(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-red-200 text-sm font-medium focus:border-red-400 outline-none bg-white" />
                    </div>
                  </div>

                  {examDateStart && examDateEnd && (
                    <div className="bg-white border border-red-200 rounded-xl px-3 py-2">
                      <p className="text-xs text-red-600">
                        📋 Session du <strong>{formatDate(examDateStart)}</strong> au <strong>{formatDate(examDateEnd)}</strong>
                        {academicYear && <> · Année <strong>{academicYear}</strong></>}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Classe (commune à tous les créneaux) ── */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap size={12} /> Classe concernée</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label-field">Licence</label>
                      <CustomSelect value={licence} onChange={(v) => { setLicence(v); setClasse(''); }} placeholder="Licence"
                        options={[{ value: '', label: 'Non spécifié' }, ...LICENCES.map(l => ({ value: l.value, label: l.label }))]} />
                    </div>
                    <div>
                      <label className="label-field">Groupe</label>
                      <CustomSelect value={classe} onChange={setClasse} placeholder="Groupe"
                        options={[{ value: 'all', label: 'Tous les groupes' }, ...(currentLic ? currentLic.classes.map(c => ({ value: c, label: c })) : [])]} />
                    </div>
                  </div>
                  {isDuplicate && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-amber-800">⚠️ Un examen existe déjà pour <strong>{licence} — {classe}</strong> cette période.</p>
                    </div>
                  )}
                </div>

                {/* ── Créneaux libres ── */}
                <div className="bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-neutral-500" />
                      <p className="text-xs font-black text-neutral-700 uppercase tracking-widest">Créneaux d'examens</p>
                      <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{creneaux.length}</span>
                    </div>
                    <button onClick={addCreneau}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      <Plus size={12} /> Ajouter un créneau
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {creneaux.length === 0 && (
                      <div className="text-center py-6 text-neutral-400">
                        <Clock size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">Aucun créneau ajouté</p>
                        <p className="text-[11px] mt-0.5">Cliquez sur « Ajouter un créneau » pour planifier les examens</p>
                      </div>
                    )}

                    <AnimatePresence>
                      {creneaux.map((c, idx) => {
                        const cDept = DEPARTEMENTS.find(d => d.value === c.dept);
                        return (
                          <motion.div key={c.id}
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-3">

                            {/* Row header */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Créneau {idx + 1}</span>
                              <button onClick={() => removeCreneau(c.id)}
                                className="p-1 hover:bg-red-200 rounded-lg text-red-400 transition-colors"><Trash2 size={13} /></button>
                            </div>

                            {/* Date + Heures */}
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="label-field">📅 Date</label>
                                <input type="date" value={c.date}
                                  min={examDateStart} max={examDateEnd}
                                  onChange={e => updateCreneau(c.id, 'date', e.target.value)}
                                  className="w-full px-2 py-2 rounded-lg border border-red-200 text-xs font-medium focus:border-red-400 outline-none bg-white" />
                              </div>
                              <div>
                                <label className="label-field">🕐 Début</label>
                                <input type="time" value={c.heureDebut}
                                  onChange={e => updateCreneau(c.id, 'heureDebut', e.target.value)}
                                  className="w-full px-2 py-2 rounded-lg border border-red-200 text-xs font-medium focus:border-red-400 outline-none bg-white" />
                              </div>
                              <div>
                                <label className="label-field">🕑 Fin</label>
                                <input type="time" value={c.heureFin}
                                  onChange={e => updateCreneau(c.id, 'heureFin', e.target.value)}
                                  className="w-full px-2 py-2 rounded-lg border border-red-200 text-xs font-medium focus:border-red-400 outline-none bg-white" />
                              </div>
                            </div>

                            {/* Dept + Matière + Salle */}
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="label-field">Département</label>
                                <CustomSelect value={c.dept} onChange={v => updateCreneau(c.id, 'dept', v)} placeholder="Dept"
                                  options={DEPARTEMENTS.map(d => ({ value: d.value, label: d.label }))} />
                              </div>
                              <div>
                                <label className="label-field">Matière</label>
                                <CustomSelect value={c.matiere} onChange={v => updateCreneau(c.id, 'matiere', v)} placeholder="Matière"
                                  options={cDept ? cDept.matieres.map(m => ({ value: m, label: m })) : []} />
                              </div>
                              <div>
                                <label className="label-field">📍 Salle</label>
                                <CustomSelect value={c.salle} onChange={v => updateCreneau(c.id, 'salle', v)} placeholder="Salle"
                                  options={SALLES.map(s => ({ value: s, label: s }))} />
                              </div>
                            </div>

                            {/* Mini récap */}
                            {c.date && c.matiere && c.heureDebut && c.heureFin && (
                              <div className="bg-white border border-red-100 rounded-lg px-2.5 py-1.5 flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold text-red-700">{formatDate(c.date)}</span>
                                <span className="text-neutral-300">·</span>
                                <span className="text-[10px] font-bold text-neutral-700">{c.heureDebut} – {c.heureFin}</span>
                                <span className="text-neutral-300">·</span>
                                <span className="text-[10px] font-bold text-blue-700">{c.matiere}</span>
                                {c.salle && <><span className="text-neutral-300">·</span><span className="text-[10px] text-amber-600 font-bold">📍{c.salle}</span></>}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══ SÉANCE NORMALE ══ */}
          {!isExam && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">📅 Jour</label>
                  <CustomSelect value={day} onChange={setDay} placeholder="Jour" options={DAYS.map(d => ({ value: d, label: d }))} />
                </div>
                <div>
                  <label className="label-field">⏰ Créneau</label>
                  <CustomSelect value={slot} onChange={setSlot} placeholder="Créneau" options={TIME_SLOTS.map(s => ({ value: s, label: s }))} />
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5"><BookOpen size={12} /> Matière</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Département</label>
                    <CustomSelect value={dept} onChange={(v) => { setDept(v); setMatiere(''); setTeacher(''); }} placeholder="Département"
                      options={DEPARTEMENTS.map(d => ({ value: d.value, label: d.label }))} />
                  </div>
                  <div>
                    <label className="label-field">Matière</label>
                    <CustomSelect value={matiere} onChange={setMatiere} placeholder="Matière"
                      options={currentDept ? currentDept.matieres.map(m => ({ value: m, label: m })) : []} />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5"><Users size={12} /> Enseignant</p>
                <CustomSelect value={teacher} onChange={setTeacher} placeholder="Choisir enseignant"
                  options={currentDept ? currentDept.teachers.map(t => ({ value: t, label: t })) : [{ value: 'Dr. Ahmed', label: 'Dr. Ahmed' }, { value: 'Mr. Karim', label: 'Mr. Karim' }]} />
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap size={12} /> Classe</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Licence</label>
                    <CustomSelect value={licence} onChange={(v) => { setLicence(v); setClasse(''); }} placeholder="Licence"
                      options={[{ value: '', label: 'Non spécifié' }, ...LICENCES.map(l => ({ value: l.value, label: l.label }))]} />
                  </div>
                  <div>
                    <label className="label-field">Groupe</label>
                    <CustomSelect value={classe} onChange={setClasse} placeholder="Groupe"
                      options={[{ value: 'all', label: 'Tous les groupes' }, ...(currentLic ? currentLic.classes.map(c => ({ value: c, label: c })) : [])]} />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-2xl p-4">
                <p className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 mb-3"><MapPin size={12} /> Salle</p>
                <CustomSelect value={salle} onChange={setSalle} placeholder="Choisir une salle" options={SALLES.map(s => ({ value: s, label: s }))} />
              </div>
            </>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50">Annuler</button>
            <button onClick={handleSave} className={`flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 ${isExam ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              <Save size={15} /> {editData ? 'Modifier' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SEANCE CARD ──────────────────────────────────────────────────────────────
function SeanceCard({ seance, onEdit, onDelete, hasConflict }) {
  const style = getTypeStyle(seance.type);
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border-2 p-3 relative group cursor-pointer ${hasConflict ? 'border-red-400 bg-red-50' : style.color}`}
      onClick={() => onEdit(seance)}>
      {hasConflict && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <AlertCircle size={9} /> Conflit
        </div>
      )}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{style.label}</span>
          </div>
          <p className="text-xs font-bold leading-tight truncate">{seance.matiere}</p>
          {seance.teacher && <p className="text-[10px] opacity-70 mt-0.5 truncate">👤 {seance.teacher}</p>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {seance.salle && <span className="text-[10px] font-bold bg-white/60 px-1.5 py-0.5 rounded-md">📍 {seance.salle}</span>}
            {seance.classe && seance.classe !== 'all' && <span className="text-[10px] font-bold bg-white/60 px-1.5 py-0.5 rounded-md">🎓 {seance.classe}</span>}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(seance.id); }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg text-red-400 shrink-0"><Trash2 size={12} /></button>
      </div>
    </motion.div>
  );
}

// ─── EXAM ACCORDION ITEM ──────────────────────────────────────────────────────
function ExamAccordion({ academicYear, exams, onEdit, onDelete, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  // Trier par date de début
  const sorted = [...exams].sort((a, b) => new Date(a.examDateStart) - new Date(b.examDateStart));

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${open ? 'border-red-300 shadow-lg shadow-red-50' : 'border-neutral-200'}`}>

      {/* ── Accordéon header ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${open ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50 text-neutral-800'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${open ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
            {exams.length}
          </div>
          <div className="text-left">
            <p className={`font-black text-base ${open ? 'text-white' : 'text-neutral-900'}`}>
              Année universitaire {academicYear}
            </p>
            <p className={`text-xs ${open ? 'text-red-100' : 'text-neutral-400'}`}>
              {exams.length} examen{exams.length > 1 ? 's' : ''} · du {formatDate(sorted[0]?.examDateStart)} au {formatDate(sorted[sorted.length - 1]?.examDateEnd)}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className={open ? 'text-white' : 'text-neutral-400'} />
        </motion.div>
      </button>

      {/* ── Contenu dépliable ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-red-50/40 p-4 space-y-3">
              {sorted.map((exam, idx) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onEdit(exam)}
                  className="bg-white border-2 border-red-100 hover:border-red-300 rounded-xl p-4 cursor-pointer group transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Examen</span>
                        {exam.licence && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {exam.licence}{exam.classe && exam.classe !== 'all' ? ` — ${exam.classe}` : ' — Tous'}
                          </span>
                        )}
                        {exam.creneaux?.length > 0 && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {exam.creneaux.length} créneau{exam.creneaux.length > 1 ? 'x' : ''}
                          </span>
                        )}
                      </div>

                      {/* Période */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                          <Calendar size={11} className="text-red-400" />
                          <span className="text-xs font-bold text-red-700">
                            {formatDate(exam.examDateStart)} → {formatDate(exam.examDateEnd)}
                          </span>
                        </div>
                      </div>

                      {/* Créneaux détaillés */}
                      {exam.creneaux?.length > 0 ? (
                        <div className="space-y-1.5">
                          {[...exam.creneaux]
                            .sort((a, b) => new Date(a.date + 'T' + a.heureDebut) - new Date(b.date + 'T' + b.heureDebut))
                            .map((c, ci) => (
                            <div key={c.id || ci} className="flex items-center gap-2 bg-white border border-red-100 rounded-lg px-3 py-2 flex-wrap">
                              <span className="text-[10px] font-black text-neutral-400 w-4">{ci + 1}.</span>
                              <span className="text-[11px] font-bold text-neutral-600">{formatDate(c.date)}</span>
                              <span className="text-neutral-300">·</span>
                              <span className="text-[11px] font-black text-red-600">{c.heureDebut} – {c.heureFin}</span>
                              <span className="text-neutral-300">·</span>
                              <span className="text-[11px] font-bold text-blue-700 truncate">{c.matiere || '—'}</span>
                              {c.salle && (
                                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">📍 {c.salle}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400 italic">Aucun créneau défini</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(exam.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-red-400 transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CONFLICT MODAL ───────────────────────────────────────────────────────────
function ConflictModal({ errors, onCancel, onForce }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center"><AlertCircle size={22} /></div>
            <h2 className="font-black text-lg">Conflit détecté !</h2>
          </div>
          <p className="text-red-100 text-sm">Cette séance crée un ou plusieurs conflits.</p>
        </div>
        <div className="p-6 space-y-3">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{err}</p>
            </div>
          ))}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <span className="text-amber-500 shrink-0">⚠️</span>
            <p className="text-xs font-medium text-amber-800">Vous pouvez forcer l'ajout, mais un conflit sera visible dans l'emploi du temps.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800">← Corriger</button>
            <button onClick={onForce} className="flex-1 py-3 rounded-xl border-2 border-red-300 text-red-600 text-sm font-bold hover:bg-red-50">Forcer quand même</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ScheduleManagement() {
  const navigate = useNavigate();

  const [activeView,     setActiveView]     = useState('normal');
  const [seances,        setSeances]        = useState([]);
  const [showModal,      setShowModal]      = useState(false);
  const [editSeance,     setEditSeance]     = useState(null);
  const [conflictErrors, setConflictErrors] = useState([]);
  const [pendingSeance,  setPendingSeance]  = useState(null);

  const [filterLicence,  setFilterLicence]  = useState('');
  const [filterClasse,   setFilterClasse]   = useState('');
  const [filterDept,     setFilterDept]     = useState('');
  const [filterMatiere,  setFilterMatiere]  = useState('');

  const currentLic = LICENCES.find(l => l.value === filterLicence);

  useEffect(() => {
    const saved = localStorage.getItem('schedules');
    if (saved) setSeances(JSON.parse(saved));
  }, []);

  const saveSeances = (data) => { setSeances(data); localStorage.setItem('schedules', JSON.stringify(data)); };

  const normalSeances = seances.filter(s => s.type !== 'exam');
  const examSeances   = seances.filter(s => s.type === 'exam');

  // Grouper les examens par année universitaire
  const examsByYear = examSeances.reduce((acc, exam) => {
    const year = exam.academicYear || 'Non défini';
    if (!acc[year]) acc[year] = [];
    acc[year].push(exam);
    return acc;
  }, {});

  // Trier les années (les plus récentes en premier)
  const sortedYears = Object.keys(examsByYear).sort((a, b) => {
    const ya = parseInt(a.split('-')[0]) || 0;
    const yb = parseInt(b.split('-')[0]) || 0;
    return yb - ya;
  });

  const handleSaveSeance = (seance) => {
    if (seance.type === 'exam') { doSave(seance); return; }
    const others = seances.filter(s => s.id !== seance.id && s.day === seance.day && s.slot === seance.slot && s.type !== 'exam');
    const conflicts = [];
    const salleConflict = others.find(s => s.salle && s.salle === seance.salle);
    if (salleConflict) conflicts.push(`📍 Conflit de salle : "${seance.salle}" occupée par "${salleConflict.matiere}"`);
    if (seance.classe && seance.classe !== 'all') {
      const cc = others.find(s => s.licence === seance.licence && (s.classe === seance.classe || s.classe === 'all'));
      if (cc) conflicts.push(`🎓 Conflit de classe : "${seance.classe}" a déjà "${cc.matiere}" à ce créneau`);
    }
    if (seance.teacher) {
      const tc = others.find(s => s.teacher === seance.teacher);
      if (tc) conflicts.push(`👤 Conflit enseignant : "${seance.teacher}" enseigne déjà "${tc.matiere}"`);
    }
    if (conflicts.length > 0) { setConflictErrors(conflicts); setPendingSeance(seance); return; }
    doSave(seance);
  };

  const doSave = (seance) => {
    const exists = seances.find(s => s.id === seance.id);
    const updated = exists ? seances.map(s => s.id === seance.id ? seance : s) : [...seances, seance];
    saveSeances(updated);
    setShowModal(false); setEditSeance(null); setConflictErrors([]); setPendingSeance(null);
  };

  const handleDelete = (id) => { if (window.confirm('Supprimer ?')) saveSeances(seances.filter(s => s.id !== id)); };
  const handleEdit   = (s) => { setEditSeance(s); setShowModal(true); };

  const filteredNormal = normalSeances.filter(s => {
    if (!filterLicence) return true;
    return s.licence === filterLicence && (!filterClasse || filterClasse === 'all' || s.classe === filterClasse || s.classe === 'all');
  });

  const getSeancesAt = (day, slot) => filteredNormal.filter(s => s.day === day && s.slot === slot);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm flex-wrap">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full"><ChevronLeft size={20} /></button>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" />
          <h1 className="text-lg font-black text-neutral-900">Emplois du Temps</h1>
        </div>

        {/* Toggle Emploi / Examens */}
        <div className="flex bg-neutral-100 p-1 rounded-xl ml-4">
          <button onClick={() => setActiveView('normal')}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeView === 'normal' ? 'bg-white shadow text-blue-600' : 'text-neutral-500'}`}>
            <Calendar size={14} /> Emploi du temps
          </button>
          <button onClick={() => setActiveView('exam')}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeView === 'exam' ? 'bg-white shadow text-red-600' : 'text-neutral-500'}`}>
            <FileText size={14} /> Examens
            {examSeances.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{examSeances.length}</span>
            )}
          </button>
        </div>

        <div className="ml-auto">
          <button onClick={() => { setEditSeance(null); setShowModal(true); }}
            className={`text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${activeView === 'exam' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            <Plus size={16} /> {activeView === 'exam' ? 'Ajouter un examen' : 'Ajouter'}
          </button>
        </div>
      </header>

      {/* ── Filtres ── */}
      <div className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-600">
          <GraduationCap size={16} className="text-emerald-600" /> Filtrer par :
        </div>
        <div className="w-44">
          <CustomSelect value={filterLicence} onChange={(v) => { setFilterLicence(v); setFilterClasse(''); }} placeholder="Licence / Niveau"
            options={[{ value: '', label: 'Toutes licences' }, ...LICENCES.map(l => ({ value: l.value, label: l.label }))]} />
        </div>
        {filterLicence && (
          <div className="w-44">
            <CustomSelect value={filterClasse} onChange={setFilterClasse} placeholder="Groupe"
              options={[{ value: '', label: 'Tous les groupes' }, { value: 'all', label: 'Cours communs' }, ...(currentLic?.classes || []).map(c => ({ value: c, label: c }))]} />
          </div>
        )}
        {filterLicence && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-emerald-700">🎓 {currentLic?.label}{filterClasse ? ` — ${filterClasse === 'all' ? 'Cours communs' : filterClasse}` : ''}</span>
            <button onClick={() => { setFilterLicence(''); setFilterClasse(''); }} className="text-emerald-500 hover:text-emerald-700"><X size={13} /></button>
          </div>
        )}
      </div>

      {/* ── Contenu ── */}
      <main className="flex-grow overflow-auto p-4">

        {/* ══ VUE NORMALE ══ */}
        {activeView === 'normal' && (
          normalSeances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Calendar size={48} className="mb-4 opacity-30" />
              <p className="font-bold text-lg">Aucune séance pour le moment</p>
            </div>
          ) : (
            <div className="min-w-[900px]">
              <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '100px repeat(6, 1fr)' }}>
                <div></div>
                {DAYS.map(day => (
                  <div key={day} className="bg-white rounded-xl py-2.5 text-center text-xs font-black text-neutral-700 border border-neutral-200 uppercase tracking-widest">{day}</div>
                ))}
              </div>
              {TIME_SLOTS.map(slot => (
                <div key={slot} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '100px repeat(6, 1fr)' }}>
                  <div className="flex items-center justify-center">
                    <div className="bg-white border border-neutral-200 rounded-xl px-2 py-3 w-full text-center">
                      <p className="text-[10px] font-black text-neutral-500">{slot.split(' – ')[0]}</p>
                      <p className="text-[9px] text-neutral-400">– {slot.split(' – ')[1]}</p>
                    </div>
                  </div>
                  {DAYS.map(day => {
                    const cells = getSeancesAt(day, slot);
                    return (
                      <div key={day} className="bg-white rounded-xl border border-neutral-200 p-1.5 min-h-[80px] flex flex-col gap-1 hover:border-blue-200 transition-colors">
                        {cells.map(s => {
                          const othersInCell = cells.filter(o => o.id !== s.id);
                          const hasConflict = othersInCell.some(o =>
                            (o.salle && o.salle === s.salle) || (o.teacher && o.teacher === s.teacher) ||
                            (o.licence === s.licence && (o.classe === s.classe || o.classe === 'all' || s.classe === 'all'))
                          );
                          return <SeanceCard key={s.id} seance={s} onEdit={handleEdit} onDelete={handleDelete} hasConflict={hasConflict} />;
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )
        )}

        {/* ══ VUE EXAMENS — Accordéons par année ══ */}
        {activeView === 'exam' && (
          <div className="max-w-3xl mx-auto space-y-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                <FileText size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-neutral-900">Emploi du Temps des Examens</h2>
                <p className="text-sm text-neutral-500">
                  {sortedYears.length} année{sortedYears.length > 1 ? 's' : ''} · {examSeances.length} examen{examSeances.length > 1 ? 's' : ''} au total
                </p>
              </div>
            </div>

            {/* Vide */}
            {sortedYears.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-white rounded-3xl border-2 border-dashed border-neutral-200">
                <FileText size={48} className="mb-4 opacity-30" />
                <p className="font-bold text-lg">Aucun examen planifié</p>
                <p className="text-sm mt-1 mb-6">Ajoutez un examen pour commencer</p>
                <button onClick={() => { setEditSeance(null); setShowModal(true); }}
                  className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 flex items-center gap-2">
                  <Plus size={16} /> Ajouter un examen
                </button>
              </div>
            )}

            {/* ✅ Accordéons groupés par année universitaire */}
            <AnimatePresence>
              {sortedYears.map((year, idx) => (
                <motion.div key={year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <ExamAccordion
                    academicYear={year}
                    exams={examsByYear[year]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    defaultOpen={idx === 0} // premier ouvert par défaut
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {conflictErrors.length > 0 && (
          <ConflictModal errors={conflictErrors}
            onCancel={() => { setConflictErrors([]); setPendingSeance(null); }}
            onForce={() => doSave(pendingSeance)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <AddSeanceModal
            onClose={() => { setShowModal(false); setEditSeance(null); }}
            onSave={handleSaveSeance}
            editData={editSeance || (activeView === 'exam' ? { type: 'exam' } : null)}
            filterLicence={filterLicence}
            filterClasse={filterClasse}
            filterDept={filterDept}
            filterMatiere={filterMatiere}
            existingExams={examSeances}
          />
        )}
      </AnimatePresence>

      <style>{`
        .label-field {
          display: block; font-size: 11px; font-weight: 700;
          color: #6b7280; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}