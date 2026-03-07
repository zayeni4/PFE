import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ChevronLeft, Save, Eye, Settings, Copy,
  Circle, Type, ListTodo, AlignLeft, Calendar, Share2,
  BarChart3, ArrowLeft, Download, FileUp, Upload,
  FileJson, FileText, FileSpreadsheet, Image,
  File, CheckCircle2, Loader2, AlertCircle, X,
  Send, BookOpen, Users, Tag, ChevronDown, Check
} from 'lucide-react';

// ─── Custom Dropdown ──────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
          open
            ? 'border-blue-500 bg-white shadow-md shadow-blue-100'
            : 'border-neutral-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
        }`}
      >
        <span className={selected ? 'text-neutral-800' : 'text-neutral-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors text-left ${
                    value === opt.value
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <Check size={14} className="text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { id: 'text',      label: 'Texte court',    icon: <Type size={16} /> },
  { id: 'paragraph', label: 'Paragraphe',     icon: <AlignLeft size={16} /> },
  { id: 'choice',    label: 'Choix multiple', icon: <ListTodo size={16} /> },
  { id: 'date',      label: 'Date',           icon: <Calendar size={16} /> },
  { id: 'file',      label: 'Dépôt fichier',  icon: <FileUp size={16} /> },
];

const SUBJECTS = [
  'Intelligence Artificielle',
  'Développement Web',
  'Réseaux Mobiles',
  'Base de Données',
  'Algorithmique',
  'Systèmes d\'Exploitation',
  'Architecture des Ordinateurs',
  'Programmation C',
  'Anglais Technique',
  'Mathématiques',
];

const TEACHERS = [
  'Dr. Ahmed',
  'Mme. Sarah',
  'Mr. Karim',
  'Dr. Leila',
  'Mr. Tarek',
];

const FILE_FORMATS = [
  { ext: ['json'],             label: 'JSON',       desc: 'Import direct',  icon: <FileJson size={20} />,        color: 'text-violet-500', bg: 'bg-violet-50',  border: 'border-violet-100'  },
  { ext: ['pdf'],              label: 'PDF',         desc: 'Cours, docs',    icon: <File size={20} />,            color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-100'     },
  { ext: ['docx','doc'],       label: 'Word',        desc: '.docx / .doc',   icon: <FileText size={20} />,        color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-100'    },
  { ext: ['xlsx','xls'],       label: 'Excel',       desc: 'Questions auto', icon: <FileSpreadsheet size={20} />, color: 'text-emerald-500',bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { ext: ['pptx'],             label: 'PowerPoint',  desc: '.pptx',          icon: <File size={20} />,            color: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-100'  },
  { ext: ['png','jpg','jpeg'], label: 'Image',       desc: 'PNG, JPG',       icon: <Image size={20} />,           color: 'text-pink-500',   bg: 'bg-pink-50',    border: 'border-pink-100'    },
  { ext: ['txt','csv'],        label: 'Texte/CSV',   desc: '.txt / .csv',    icon: <FileText size={20} />,        color: 'text-neutral-500',bg: 'bg-neutral-50', border: 'border-neutral-200' },
];

// ─── PPTX extractor ───────────────────────────────────────────────────────────
const extractPptxText = async (file) => {
  try {
    const zip = await JSZip.loadAsync(file);
    let text = '';
    const slides = Object.keys(zip.files)
      .filter(n => n.startsWith('ppt/slides/slide') && n.endsWith('.xml'))
      .sort((a, b) => parseInt(a.match(/\d+/)?.[0] || 0) - parseInt(b.match(/\d+/)?.[0] || 0));
    for (const s of slides) {
      const xml = await zip.file(s).async('text');
      const matches = xml.match(/<a:t>(.*?)<\/a:t>/g);
      if (matches) text += matches.map(m => m.replace(/<a:t>|<\/a:t>/g, '')).join(' ') + ' ';
    }
    return text.trim();
  } catch { return ''; }
};

const parseExcelToQuestionnaire = (arrayBuffer, fileName) => {
  const wb = XLSX.read(arrayBuffer);
  const questionSheetName = wb.SheetNames.find(n => /question/i.test(n)) || wb.SheetNames[0];
  const optionSheetName = wb.SheetNames.find(n => /option|r[eé]ponse|choix/i.test(n));
  let globalOptions = [];
  if (optionSheetName) {
    const optSheet = wb.Sheets[optionSheetName];
    const optRows = XLSX.utils.sheet_to_json(optSheet, { header: 1, defval: '' });
    if (optRows.length > 1) {
      const headerRow = optRows[0].map(h => String(h).toLowerCase());
      const labelColIdx = headerRow.findIndex(h => /option|label|r[eé]ponse|choix|texte/.test(h)) !== -1
        ? headerRow.findIndex(h => /option|label|r[eé]ponse|choix|texte/.test(h)) : 0;
      globalOptions = optRows.slice(1).map(r => String(r[labelColIdx] ?? '').trim()).filter(Boolean);
    }
  }
  const qSheet = wb.Sheets[questionSheetName];
  const rows = XLSX.utils.sheet_to_json(qSheet, { header: 1, defval: '' });
  if (rows.length < 2) return buildFallback(wb, fileName);
  const headerRow = rows[0].map(h => String(h).toLowerCase().trim());
  const qColIdx = headerRow.findIndex(h => /question|intitul[eé]|libell[eé]|texte|item|ennonc[eé]/.test(h));
  const questionCol = qColIdx !== -1 ? qColIdx : Math.min(1, headerRow.length - 1);
  const typeColIdx = headerRow.findIndex(h => /type/.test(h));
  const questions = rows.slice(1).filter(row => row[questionCol] && String(row[questionCol]).trim())
    .map((row, i) => {
      const title = String(row[questionCol]).trim();
      let type = 'choice';
      if (typeColIdx !== -1) {
        const rawType = String(row[typeColIdx] || '').toLowerCase();
        if (/texte|text|open|libre/.test(rawType)) type = 'text';
        else if (/paragraphe|long/.test(rawType)) type = 'paragraph';
        else if (/date/.test(rawType)) type = 'date';
        else if (/fichier|file/.test(rawType)) type = 'file';
      }
      const options = globalOptions.length > 0 ? globalOptions : ['Oui', 'Non'];
      return { id: `q${i + 1}`, type, title, required: false, options: type === 'choice' ? options : [] };
    });
  const title = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: `${questions.length} question(s) importée(s) depuis ${fileName}`,
    questions: questions.length > 0 ? questions : [{ id: 'q1', type: 'text', title: 'Question sans titre', required: false, options: [] }],
  };
};

const buildFallback = (wb, fileName) => {
  let txt = '';
  wb.SheetNames.forEach(s => { txt += XLSX.utils.sheet_to_txt(wb.Sheets[s]) + '\n'; });
  const title = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: txt.replace(/\s+/g, ' ').trim().substring(0, 300),
    questions: [{ id: 'q1', type: 'text', title: 'Question sans titre', required: false, options: [] }],
  };
};

const extractTextContent = async (file) => {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  }
  if (name.endsWith('.pptx')) return await extractPptxText(file);
  if (file.type.startsWith('image/')) return `[Image : ${file.name}]`;
  try { return await file.text(); } catch { return ''; }
};

const buildFromText = (file, rawText) => {
  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  const description = rawText?.replace(/\s+/g, ' ').replace(/[^\x20-\x7EÀ-öø-ÿ]/g, ' ').trim().substring(0, 300) || '';
  return {
    title,
    description: description || `Questionnaire importé depuis ${file.name}`,
    questions: [{ id: 'q1', type: 'text', title: 'Question sans titre', required: false, options: [] }],
  };
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const LICENCES = [
  { value: 'L1', label: 'Licence 1 (L1)', classes: ['L1-A', 'L1-B', 'L1-CS', 'L1-IT'] },
  { value: 'L2', label: 'Licence 2 (L2)', classes: ['L2-A', 'L2-B', 'L2-CS', 'L2-IT'] },
  { value: 'L3', label: 'Licence 3 (L3)', classes: ['L3-A', 'L3-B', 'L3-CS', 'L3-IT'] },
  { value: 'M1', label: 'Master 1 (M1)',  classes: ['M1-SI', 'M1-ESE', 'M1-DS', 'M1-IGP'] },
  { value: 'M2', label: 'Master 2 (M2)',  classes: ['M2-SI', 'M2-ESE', 'M2-DS', 'M2-IGP'] },
  { value: 'ING', label: 'Cycle Ingénieur', classes: ['ING1', 'ING2', 'ING3'] },
];

// ─── Publish Modal ────────────────────────────────────────────────────────────
function PublishModal({ questionnaire, onClose, onPublish }) {
  const [licence,       setLicence]       = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [publishAll,    setPublishAll]    = useState(false);

  const currentLicence = LICENCES.find(l => l.value === licence);

  const handleSubmit = () => {
    if (!publishAll && !licence) {
      alert('Veuillez choisir une licence ou publier pour tous.');
      return;
    }
    onPublish({
      publishAll,
      licence:  publishAll ? 'Toutes licences' : currentLicence?.label,
      classe:   publishAll ? 'Toutes classes'  : selectedClass,
      subject:  questionnaire.subject || '',
      teacher:  questionnaire.teacher || '',
      target:   'students',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Send size={20} />
              <h2 className="font-black text-lg">Publier le questionnaire</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"><X size={18} /></button>
          </div>
          <p className="text-blue-100 text-sm truncate">« {questionnaire.title} »</p>
        </div>

        <div className="p-6 space-y-5">

          {/* Publier pour tous */}
          <button
            onClick={() => { setPublishAll(!publishAll); setLicence(''); setSelectedClass('all'); }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              publishAll ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-blue-200 hover:bg-blue-50/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div className="text-left">
                <p className="font-bold text-neutral-900 text-sm">Publier pour tout le monde</p>
                <p className="text-xs text-neutral-500">Toutes les licences et toutes les classes</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${publishAll ? 'border-blue-500 bg-blue-500' : 'border-neutral-300'}`}>
              {publishAll && <Check size={12} className="text-white" />}
            </div>
          </button>

          {/* Séparateur */}
          {!publishAll && (
            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-neutral-200"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Ou choisir</span>
              <div className="flex-grow h-px bg-neutral-200"></div>
            </div>
          )}

          {/* Licence */}
          {!publishAll && (
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest block mb-2">
                🎓 Licence / Niveau *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LICENCES.map(l => (
                  <button
                    key={l.value}
                    onClick={() => { setLicence(l.value); setSelectedClass('all'); }}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      licence === l.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    {l.value}
                  </button>
                ))}
              </div>
              {licence && (
                <p className="text-xs text-neutral-400 mt-1.5 font-medium">{currentLicence?.label}</p>
              )}
            </div>
          )}

          {/* Classe */}
          {!publishAll && licence && (
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest block mb-2">
                🏫 Classe
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Option toutes les classes */}
                <button
                  onClick={() => setSelectedClass('all')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all col-span-1 ${
                    selectedClass === 'all'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                  }`}
                >
                  Toutes
                </button>
                {currentLicence?.classes.map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      selectedClass === cls
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Résumé */}
          {(publishAll || licence) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <p className="text-xs font-bold text-emerald-700">
                {publishAll
                  ? 'Publié pour toutes les licences et classes'
                  : `Publié pour ${currentLicence?.label} — ${selectedClass === 'all' ? 'toutes les classes' : selectedClass}`
                }
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={15} /> Publier maintenant
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ImportSection ────────────────────────────────────────────────────────────
function ImportSection({ questionnaires, onImportSuccess }) {
  const [isDragging, setIsDragging]       = useState(false);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [status, setStatus]               = useState('idle');
  const [errorMsg, setErrorMsg]           = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef(null);

  const reset = () => { setSelectedFile(null); setStatus('idle'); setErrorMsg(''); setImportedCount(0); };

  const getFileFormat = (file) => {
    const name = file.name.toLowerCase();
    return FILE_FORMATS.find(f => f.ext.some(e => name.endsWith('.' + e)));
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setStatus('loading');
    setErrorMsg('');
    try {
      let data;
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        const text = await file.text();
        const imported = JSON.parse(text);
        if (!imported.title || !imported.questions) throw new Error('Format JSON invalide.');
        data = imported;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buf = await file.arrayBuffer();
        data = parseExcelToQuestionnaire(buf, file.name);
      } else {
        const rawText = await extractTextContent(file);
        data = buildFromText(file, rawText);
      }
      const newQ = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), responses: data.responses || [], sentToStudents: false };
      setImportedCount(newQ.questions?.length || 0);
      onImportSuccess([...questionnaires, newQ]);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la lecture du fichier.');
      setStatus('error');
    }
  }, [questionnaires, onImportSuccess]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const fmt = selectedFile ? getFileFormat(selectedFile) : null;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow shadow-blue-200">
            <Upload size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-neutral-900 tracking-tight">Importer un fichier</h2>
            <p className="text-[11px] text-neutral-400">Questions auto-détectées depuis Excel</p>
          </div>
        </div>
        {status !== 'idle' && (
          <button onClick={reset} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"><X size={15} /></button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {status === 'idle' && (
          <>
            {/* Format buttons - each clickable */}
            <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Cliquez sur un format pour importer</p>
              <div className="grid grid-cols-2 gap-2">
                {FILE_FORMATS.map((f) => {
                  const acceptMap = {
                    'JSON':       '.json',
                    'PDF':        '.pdf',
                    'Word':       '.docx,.doc',
                    'Excel':      '.xlsx,.xls',
                    'PowerPoint': '.pptx',
                    'Image':      '.png,.jpg,.jpeg',
                    'Texte/CSV':  '.txt,.csv',
                  };
                  const accept = acceptMap[f.label] || '*/*';
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = accept;
                        input.onchange = (e) => { const file = e.target.files[0]; if (file) processFile(file); };
                        input.click();
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.03] hover:shadow-md active:scale-95 text-left ${f.bg} ${f.border}`}
                    >
                      <span className={f.color}>{f.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-700 leading-none">{f.label}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{f.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag & drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 py-4 px-4 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-neutral-200 bg-neutral-50 hover:border-blue-300 hover:bg-blue-50/40'}`}
            >
              <Upload size={16} className={isDragging ? 'text-blue-500' : 'text-neutral-400'} />
              <p className="text-xs font-medium text-neutral-500">
                {isDragging ? 'Relâchez pour importer' : "Ou glissez n'importe quel fichier ici"}
              </p>
              <input ref={fileInputRef} type="file" accept="*/*" onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f); e.target.value = ''; }} className="hidden" />
            </div>
          </>
        )}

        {status === 'loading' && (
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 py-10 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md ${fmt?.bg || 'bg-white'}`}>
              <span className={fmt?.color || 'text-neutral-400'}>{fmt?.icon || <File size={26} />}</span>
            </div>
            <p className="font-bold text-neutral-700 text-sm mb-1 max-w-[200px] truncate">{selectedFile?.name}</p>
            <div className="flex items-center gap-2 text-blue-600 mt-2">
              <Loader2 size={15} className="animate-spin" />
              <span className="text-xs font-semibold">Lecture et analyse...</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-9 flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <CheckCircle2 size={30} className="text-emerald-500" />
            </div>
            <p className="font-bold text-neutral-800 text-sm mb-1">Questionnaire créé !</p>
            {importedCount > 0 && <p className="text-xs text-emerald-600 font-semibold mb-1">✦ {importedCount} question{importedCount > 1 ? 's' : ''} importée{importedCount > 1 ? 's' : ''}</p>}
            <p className="text-xs text-neutral-400 mb-4">Pensez à le publier pour vos étudiants</p>
            <button onClick={reset} className="text-xs font-semibold text-emerald-600 hover:underline">Importer un autre fichier</button>
          </motion.div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 py-8 flex flex-col items-center text-center px-6">
            <AlertCircle size={28} className="text-red-400 mb-3" />
            <p className="font-bold text-neutral-800 text-sm mb-1">Échec de l'import</p>
            <p className="text-xs text-red-500 mb-4 max-w-xs">{errorMsg}</p>
            <button onClick={reset} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors">Réessayer</button>
          </div>
        )}


      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuestionnaireManagement() {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isCreating, setIsCreating]         = useState(false);
  const [currentForm, setCurrentForm]       = useState(null);
  const [activeTab, setActiveTab]           = useState('questions');
  const [publishTarget, setPublishTarget]   = useState(null); // questionnaire à publier

  useEffect(() => {
    const saved = localStorage.getItem('questionnaires');
    if (saved) setQuestionnaires(JSON.parse(saved));
  }, []);

  const save = (data) => { setQuestionnaires(data); localStorage.setItem('questionnaires', JSON.stringify(data)); };
  const handleImportSuccess = (list) => save(list);

  const handleCreateNew = () => {
    setCurrentForm({
      id: Date.now().toString(),
      title: 'Nouveau Questionnaire sans titre',
      description: 'Description du questionnaire...',
      questions: [{ id: 'q1', type: 'choice', title: 'Question sans titre', required: false, options: ['Option 1'] }],
      createdAt: new Date().toISOString(),
      responses: [],
      sentToStudents: false,
      subject: '',
      teacher: '',
      target: 'students',
    });
    setIsCreating(true);
  };

  const handleSaveForm = () => {
    const updated = [...questionnaires];
    const idx = updated.findIndex(q => q.id === currentForm.id);
    if (idx >= 0) updated[idx] = currentForm; else updated.push(currentForm);
    save(updated); setIsCreating(false); setCurrentForm(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce questionnaire ?')) return;
    save(questionnaires.filter(q => q.id !== id));
  };

  // Publication
  const handlePublish = ({ publishAll, licence, classe, subject, teacher, target }) => {
    const updated = questionnaires.map(q =>
      q.id === publishTarget.id
        ? { ...q, sentToStudents: true, publishAll, licence, classe, subject, teacher, target, publishedAt: new Date().toISOString() }
        : q
    );
    save(updated);
    setPublishTarget(null);
    const msg = publishAll ? 'Toutes licences — Toutes classes' : `${licence} — ${classe === 'all' ? 'Toutes les classes' : classe}`;
    alert(`✅ Questionnaire publié pour : ${msg}`);
  };

  const handleUnpublish = (id) => {
    const updated = questionnaires.map(q => q.id === id ? { ...q, sentToStudents: false } : q);
    save(updated);
  };

  const addQuestion    = (type) => setCurrentForm({ ...currentForm, questions: [...currentForm.questions, { id: Date.now().toString(), type, title: '', required: false, options: type === 'choice' ? ['Option 1'] : [] }] });
  const updateQuestion = (id, field, value) => setCurrentForm({ ...currentForm, questions: currentForm.questions.map(q => q.id === id ? { ...q, [field]: value } : q) });
  const removeQuestion = (id) => setCurrentForm({ ...currentForm, questions: currentForm.questions.filter(q => q.id !== id) });
  const addOption      = (qid) => setCurrentForm({ ...currentForm, questions: currentForm.questions.map(q => q.id === qid ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q) });
  const updateOption   = (qid, i, val) => setCurrentForm({ ...currentForm, questions: currentForm.questions.map(q => { if (q.id !== qid) return q; const o = [...q.options]; o[i] = val; return { ...q, options: o }; }) });
  const removeOption   = (qid, i) => setCurrentForm({ ...currentForm, questions: currentForm.questions.map(q => q.id === qid ? { ...q, options: q.options.filter((_, idx) => idx !== i) } : q) });

  const copyLink = (id) => { navigator.clipboard.writeText(`${window.location.origin}/questionnaire/${id}`); alert('Lien copié !'); };
  const handleExport = (q) => {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(q, null, 2));
    a.download = `questionnaire_${q.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const getStats = (question, responses) => {
    if (!responses?.length || question.type !== 'choice') return null;
    const stats = {};
    question.options.forEach(opt => stats[opt] = 0);
    responses.forEach(r => { const a = r.answers[question.id]; if (a && stats[a] !== undefined) stats[a]++; });
    return stats;
  };

  // ── Éditeur ────────────────────────────────────────────────────────────────
  if (isCreating && currentForm) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-neutral-100 rounded-full flex-shrink-0">
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0">
              <input
                value={currentForm.title}
                onChange={e => setCurrentForm({...currentForm, title: e.target.value})}
                className="text-base font-bold bg-transparent border-none outline-none w-48 truncate text-neutral-900 placeholder-neutral-400"
                placeholder="Titre"
              />
              <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Brouillon</p>
            </div>
          </div>

          {/* Center: tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-lg mx-4 flex-shrink-0">
            {['questions', 'responses'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-neutral-500'}`}
              >
                {tab === 'questions' ? 'Questions' : `Réponses (${currentForm.responses?.length || 0})`}
              </button>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => navigate(`/questionnaire/${currentForm.id}`)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Aperçu"><Eye size={18} /></button>
            <button onClick={() => handleExport(currentForm)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Exporter"><Download size={18} /></button>
            <button onClick={() => copyLink(currentForm.id)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Copier le lien"><Share2 size={18} /></button>
            <button onClick={handleSaveForm} className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 flex-shrink-0">
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </header>

        <main className="flex-grow py-10 px-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeTab === 'questions' ? (
              <>
                {/* Titre + Description */}
                <div className="bg-white rounded-xl shadow-sm border-t-8 border-t-blue-600 border border-neutral-200 p-8">
                  <input
                    value={currentForm.title}
                    onChange={e => setCurrentForm({...currentForm, title: e.target.value})}
                    className="text-3xl font-bold w-full border-none outline-none mb-4 text-neutral-900 placeholder-neutral-300"
                    placeholder="Titre du questionnaire"
                  />
                  <textarea
                    value={currentForm.description}
                    onChange={e => setCurrentForm({...currentForm, description: e.target.value})}
                    className="w-full border-none outline-none text-neutral-700 placeholder-neutral-300 resize-none min-h-[60px]"
                    placeholder="Description..."
                  />
                </div>

                {/* Matière & Enseignant dans l'éditeur */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                  <h3 className="text-sm font-black text-neutral-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Tag size={14} className="text-blue-600" /> Informations de publication
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 block mb-1.5">Matière</label>
                      <CustomSelect
                        value={currentForm.subject || ''}
                        onChange={val => setCurrentForm({...currentForm, subject: val})}
                        placeholder="-- Choisir une matière --"
                        options={[{ value: '', label: '-- Choisir --' }, ...SUBJECTS.map(s => ({ value: s, label: s }))]}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 block mb-1.5">Enseignant responsable</label>
                      <CustomSelect
                        value={currentForm.teacher || ''}
                        onChange={val => setCurrentForm({...currentForm, teacher: val})}
                        placeholder="-- Optionnel --"
                        options={[{ value: '', label: '-- Optionnel --' }, ...TEACHERS.map(t => ({ value: t, label: t }))]}
                      />
                    </div>
                  </div>
                </div>

                {/* Questions */}
                {currentForm.questions.map((q, idx) => (
                  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={q.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-neutral-400 font-bold mt-2">{idx + 1}.</span>
                      <div className="flex-grow space-y-4">
                        <div className="flex items-center gap-4">
                          <input value={q.title} onChange={e => updateQuestion(q.id, 'title', e.target.value)} className="flex-grow text-lg font-medium border-b border-neutral-200 focus:border-blue-600 outline-none pb-1 text-neutral-900 placeholder-neutral-400" placeholder="Votre question" />
                          <CustomSelect
                            value={q.type}
                            onChange={val => updateQuestion(q.id, 'type', val)}
                            placeholder="Type"
                            options={QUESTION_TYPES.map(t => ({ value: t.id, label: t.label }))}
                          />
                        </div>
                        {q.type === 'choice' && (
                          <div className="space-y-3 pl-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-3">
                                <Circle size={16} className="text-neutral-300" />
                                <input value={opt} onChange={e => updateOption(q.id, oi, e.target.value)} className="flex-grow text-sm border-b border-transparent focus:border-neutral-200 outline-none py-1 text-neutral-800 placeholder-neutral-400" />
                                {q.options.length > 1 && <button onClick={() => removeOption(q.id, oi)} className="text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>}
                              </div>
                            ))}
                            <button onClick={() => addOption(q.id)} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={14} /> Ajouter une option</button>
                          </div>
                        )}
                        {(q.type === 'text' || q.type === 'paragraph') && (
                          <div className="pl-2"><div className="border-b border-dashed border-neutral-200 py-2 text-neutral-400 text-sm italic">Zone de réponse {q.type === 'paragraph' ? 'longue' : 'courte'}</div></div>
                        )}
                        {q.type === 'file' && (
                          <div className="pl-2"><div className="border border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center text-neutral-400 bg-neutral-50"><FileUp size={24} className="mb-2" /><span className="text-sm">Dépôt de fichiers</span></div></div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-50 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer mr-auto">
                        <input type="checkbox" checked={q.required} onChange={e => updateQuestion(q.id, 'required', e.target.checked)} className="rounded text-blue-600" />
                        <span className="text-xs font-medium text-neutral-500">Obligatoire</span>
                      </label>
                      <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"><Copy size={18} /></button>
                      <button onClick={() => removeQuestion(q.id)} className="p-2 hover:bg-red-50 rounded-lg text-neutral-500 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </motion.div>
                ))}

                {/* Ajouter question */}
                <div className="flex justify-center pt-4">
                  <div className="bg-white shadow-lg border border-neutral-200 rounded-2xl p-2 flex items-center gap-1 flex-wrap justify-center">
                    {QUESTION_TYPES.map(type => (
                      <button key={type.id} onClick={() => addQuestion(type.id)} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-sm font-bold text-neutral-600">
                        {type.icon}{type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Onglet Réponses */
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div><h2 className="text-3xl font-bold">{currentForm.responses?.length || 0}</h2><p className="text-neutral-500">Réponses totales</p></div>
                  <button onClick={() => copyLink(currentForm.id)} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-100"><Share2 size={18} /> Partager</button>
                </div>
                {!currentForm.responses?.length ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400"><BarChart3 size={40} /></div>
                    <h3 className="text-xl font-bold mb-2">Aucune réponse pour le moment</h3>
                    <p className="text-neutral-400 text-sm">Les réponses apparaîtront ici une fois que les étudiants auront répondu.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentForm.questions.map((q, i) => {
                      const stats = getStats(q, currentForm.responses);
                      return (
                        <div key={q.id} className="border-t border-neutral-100 pt-6">
                          <h4 className="font-bold mb-4">{i + 1}. {q.title}</h4>
                          {q.type === 'choice' && stats ? (
                            <div className="space-y-3">
                              {Object.entries(stats).map(([opt, count]) => {
                                const pct = Math.round((count / currentForm.responses.length) * 100);
                                return (
                                  <div key={opt} className="space-y-1">
                                    <div className="flex justify-between text-sm"><span className="font-medium">{opt}</span><span className="text-neutral-500">{count} ({pct}%)</span></div>
                                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{ width: `${pct}%` }} /></div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {currentForm.responses.slice(0, 5).map((r, ri) => (
                                <div key={ri} className="bg-neutral-50 p-3 rounded-lg text-sm">{r.answers[q.id] || <span className="italic text-neutral-400">Pas de réponse</span>}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Vue principale ─────────────────────────────────────────────────────────
  const published   = questionnaires.filter(q => q.sentToStudents);
  const unpublished = questionnaires.filter(q => !q.sentToStudents);

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      {/* Modal publication */}
      {publishTarget && (
        <PublishModal
          questionnaire={publishTarget}
          onClose={() => setPublishTarget(null)}
          onPublish={handlePublish}
        />
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-4 font-bold text-sm uppercase tracking-widest">
              <ArrowLeft size={16} /> Retour au tableau de bord
            </button>
            <h1 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter">Gestion Questionnaires</h1>
            <p className="text-neutral-500">Créez, importez et publiez vos questionnaires par matière.</p>
          </div>
          <button onClick={handleCreateNew} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95">
            <Plus size={22} /> Nouveau Questionnaire
          </button>
        </header>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', count: questionnaires.length, color: 'text-neutral-900', bg: 'bg-white', icon: <ListTodo size={18} className="text-blue-600" /> },
            { label: 'Publiés', count: published.length, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <Send size={18} className="text-emerald-600" /> },
            { label: 'Brouillons', count: unpublished.length, color: 'text-amber-700', bg: 'bg-amber-50', icon: <FileText size={18} className="text-amber-600" /> },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl border border-neutral-200 p-4 flex items-center gap-4`}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">{s.icon}</div>
              <div>
                <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Import */}
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <ImportSection questionnaires={questionnaires} onImportSuccess={handleImportSuccess} />
          </div>

          {/* Liste */}
          <div className="lg:col-span-2 space-y-8">
            {questionnaires.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-200 p-16 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600"><ListTodo size={40} /></div>
                <h2 className="text-xl font-bold text-neutral-900 mb-3">Aucun questionnaire</h2>
                <p className="text-neutral-500 max-w-sm mx-auto mb-8 text-sm">Créez votre premier formulaire ou importez un fichier.</p>
                <button onClick={handleCreateNew} className="bg-neutral-900 text-white px-7 py-3 rounded-2xl font-bold hover:bg-black text-sm">Créer maintenant</button>
              </div>
            ) : (
              <>
                {/* Publiés */}
                {published.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <h2 className="text-sm font-black text-neutral-700 uppercase tracking-widest">Publiés ({published.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {published.map(q => (
                          <QuestionnaireCard
                            key={q.id}
                            q={q}
                            onEdit={() => { setCurrentForm(q); setIsCreating(true); }}
                            onDelete={() => handleDelete(q.id)}
                            onExport={() => handleExport(q)}
                            onCopyLink={() => copyLink(q.id)}
                            onPreview={() => navigate(`/questionnaire/${q.id}`)}
                            onPublish={() => setPublishTarget(q)}
                            onUnpublish={() => handleUnpublish(q.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Brouillons */}
                {unpublished.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <h2 className="text-sm font-black text-neutral-700 uppercase tracking-widest">Brouillons ({unpublished.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {unpublished.map(q => (
                          <QuestionnaireCard
                            key={q.id}
                            q={q}
                            onEdit={() => { setCurrentForm(q); setIsCreating(true); }}
                            onDelete={() => handleDelete(q.id)}
                            onExport={() => handleExport(q)}
                            onCopyLink={() => copyLink(q.id)}
                            onPreview={() => navigate(`/questionnaire/${q.id}`)}
                            onPublish={() => setPublishTarget(q)}
                            onUnpublish={() => handleUnpublish(q.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────
function QuestionnaireCard({ q, onEdit, onDelete, onExport, onCopyLink, onPreview, onPublish, onUnpublish }) {
  const isPublished = q.sentToStudents;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
    >
      {/* Header coloré */}
      <div className={`h-28 relative p-5 flex flex-col justify-end ${isPublished ? 'bg-gradient-to-br from-emerald-600 to-emerald-500' : 'bg-gradient-to-br from-blue-600 to-blue-500'}`}>
        {/* Statut */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPublished ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-white animate-pulse' : 'bg-white/60'}`}></div>
          {isPublished ? 'EN LIGNE' : 'BROUILLON'}
        </div>

        {/* Actions hover */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md" title="Modifier"><Settings size={15} /></button>
          <button onClick={onExport} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md" title="Exporter"><Download size={15} /></button>
          <button onClick={onDelete} className="p-1.5 bg-white/20 hover:bg-red-500/50 rounded-lg text-white backdrop-blur-md" title="Supprimer"><Trash2 size={15} /></button>
        </div>

        <h3 className="text-white font-bold text-lg truncate leading-tight">{q.title}</h3>
      </div>

      <div className="p-5">
        {/* Licence & Classe */}
        {(q.licence || q.publishAll) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">
              🎓 {q.publishAll ? 'Toutes licences' : q.licence}
            </span>
            {!q.publishAll && q.classe && (
              <span className="flex items-center gap-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-1 rounded-full">
                🏫 {q.classe === 'all' ? 'Toutes classes' : q.classe}
              </span>
            )}
            {q.publishAll && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
                🌐 Toutes classes
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1.5"><BarChart3 size={13} /><span>{q.responses?.length || 0} réponses</span></div>
          <span>{new Date(q.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Publier / Dépublier */}
          {isPublished ? (
            <button onClick={onUnpublish} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-200">
              <CheckCircle2 size={14} /> PUBLIÉ — Retirer
            </button>
          ) : (
            <button onClick={onPublish} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <Send size={14} /> Publier pour les étudiants
            </button>
          )}

          {/* Actions secondaires */}
          <div className="flex gap-2">
            <button onClick={onEdit} className="flex-grow bg-neutral-100 text-neutral-900 py-2 rounded-xl font-bold hover:bg-neutral-200 text-xs">Modifier</button>
            <button onClick={onCopyLink} className="px-3 bg-blue-50 text-blue-600 py-2 rounded-xl font-bold hover:bg-blue-100" title="Copier le lien"><Share2 size={15} /></button>
            <button onClick={onPreview} className="px-3 bg-neutral-50 text-neutral-600 py-2 rounded-xl font-bold hover:bg-neutral-100" title="Aperçu"><Eye size={15} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}