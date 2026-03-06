import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, ChevronLeft, Eye, Settings,
  Circle, Type, ListTodo, AlignLeft, Calendar, Share2,
  BarChart3, ArrowLeft, Download, FileUp,
  CheckCircle2, Send, MessageSquare, Users, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Constants ───────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { id: 'text',      label: 'Texte court',    icon: <Type size={16} /> },
  { id: 'paragraph', label: 'Paragraphe',     icon: <AlignLeft size={16} /> },
  { id: 'choice',    label: 'Choix multiple', icon: <ListTodo size={16} /> },
  { id: 'date',      label: 'Date',           icon: <Calendar size={16} /> },
  { id: 'file',      label: 'Dépôt fichier',  icon: <FileUp size={16} /> },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function QuestionnaireManagement() {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isViewing, setIsViewing]           = useState(false);
  const [currentForm, setCurrentForm]       = useState(null);
  const [activeTab, setActiveTab]           = useState('responses');

  useEffect(() => {
    const saved = localStorage.getItem('questionnaires');
    if (saved) {
      setQuestionnaires(JSON.parse(saved));
    } else {
      // Données de démonstration pour l'enseignant
      const mockData = [
        {
          id: '1',
          title: 'Évaluation Mathématiques - Algèbre',
          description: 'Questionnaire sur les équations du second degré et les fonctions.',
          questions: [
            { id: 'q1', type: 'choice', title: 'Quelle est la solution de x² = 4 ?', required: true, options: ['2', '-2', '2 et -2', '0'] },
            { id: 'q2', type: 'text', title: 'Définissez une fonction affine.', required: false, options: [] },
            { id: 'q3', type: 'paragraph', title: 'Commentaires sur le cours ?', required: false, options: [] }
          ],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          responses: [
            { id: 'r1', student: 'Jean Dupont', answers: { q1: '2 et -2', q2: 'f(x) = ax + b', q3: 'Très clair, merci !' }, feedback: 'Bonne compréhension.' },
            { id: 'r2', student: 'Marie Curie', answers: { q1: '2', q2: 'Une droite', q3: 'Un peu rapide sur la fin.' }, feedback: 'Attention à la rigueur.' }
          ],
          sentToStudents: true
        },
        {
          id: '2',
          title: 'TP Physique - Optique',
          description: 'Rendu du compte-rendu de TP sur les lentilles.',
          questions: [
            { id: 'q1', type: 'file', title: 'Téléchargez votre compte-rendu (PDF)', required: true, options: [] }
          ],
          createdAt: new Date().toISOString(),
          responses: [],
          sentToStudents: false
        }
      ];
      setQuestionnaires(mockData);
      localStorage.setItem('questionnaires', JSON.stringify(mockData));
    }
  }, []);

  const saveToLocalStorage = (data) => localStorage.setItem('questionnaires', JSON.stringify(data));

  const handleSendToStudents = (id) => {
    const updated = questionnaires.map(q => 
      q.id === id ? { ...q, sentToStudents: true } : q
    );
    setQuestionnaires(updated);
    saveToLocalStorage(updated);
    alert('Le questionnaire a été envoyé à l\'espace étudiant !');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce questionnaire de votre vue ?')) return;
    const updated = questionnaires.filter(q => q.id !== id);
    setQuestionnaires(updated);
    saveToLocalStorage(updated);
  };

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/questionnaire/${id}`);
    alert('Lien copié !');
  };

  const handleExport = (q) => {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(q, null, 2));
    a.download = `responses_${q.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getStats = (question, responses) => {
    if (!responses?.length || question.type !== 'choice') return null;
    const stats = {};
    question.options.forEach(opt => stats[opt] = 0);
    responses.forEach(r => {
      const a = r.answers[question.id];
      if (a && stats[a] !== undefined) stats[a]++;
    });
    return stats;
  };

  // ── Vue Détails / Réponses ────────────────────────────────────────────────
  if (isViewing && currentForm) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <header className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsViewing(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{currentForm.title}</h2>
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Tableau de bord Enseignant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-100 p-1 rounded-lg mr-4">
              {['questions', 'responses'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-neutral-500'}`}
                >
                  {tab === 'questions' ? 'Questions' : `Réponses (${currentForm.responses?.length || 0})`}
                </button>
              ))}
            </div>
            <button onClick={() => handleExport(currentForm)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Exporter"><Download size={18} /></button>
            <button onClick={() => copyLink(currentForm.id)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Partager"><Share2 size={18} /></button>
            {!currentForm.sentToStudents && (
              <button 
                onClick={() => handleSendToStudents(currentForm.id)} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Send size={16} /> Envoyer aux étudiants
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow py-10 px-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {activeTab === 'questions' ? (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
                  <h1 className="text-3xl font-black text-neutral-900 mb-4">{currentForm.title}</h1>
                  <p className="text-neutral-500">{currentForm.description}</p>
                </div>

                {currentForm.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-neutral-300 font-black text-xl mt-1">{idx + 1}.</span>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-neutral-800">{q.title}</h3>
                          <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md uppercase font-black tracking-wider">
                            {QUESTION_TYPES.find(t => t.id === q.type)?.label}
                          </span>
                        </div>
                        {q.type === 'choice' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50/50">
                                <Circle size={14} className="text-neutral-300" />
                                <span className="text-sm font-medium text-neutral-600">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {(q.type === 'text' || q.type === 'paragraph') && (
                          <div className="pl-2 border-l-4 border-blue-50 py-2 text-neutral-400 text-sm italic">
                            Réponse attendue ({q.type === 'paragraph' ? 'longue' : 'courte'})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Total Réponses</p>
                    <p className="text-3xl font-black text-blue-600">{currentForm.responses?.length || 0}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Taux de complétion</p>
                    <p className="text-3xl font-black text-emerald-500">85%</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Dernière réponse</p>
                    <p className="text-lg font-bold text-neutral-700">Il y a 2h</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
                  <h3 className="text-xl font-black text-neutral-900 mb-8 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    Analyse des résultats
                  </h3>
                  
                  {!currentForm.responses?.length ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                        <Clock size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-800 mb-2">En attente de réponses</h3>
                      <p className="text-neutral-500 text-sm">Les résultats s'afficheront ici dès que les étudiants auront répondu.</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {currentForm.questions.map((q, i) => {
                        const stats = getStats(q, currentForm.responses);
                        return (
                          <div key={q.id} className="space-y-4">
                            <h4 className="font-bold text-neutral-800 flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                              {q.title}
                            </h4>
                            {q.type === 'choice' && stats ? (
                              <div className="grid grid-cols-1 gap-3 pl-9">
                                {Object.entries(stats).map(([opt, count]) => {
                                  const pct = Math.round((count / currentForm.responses.length) * 100);
                                  return (
                                    <div key={opt} className="space-y-1.5">
                                      <div className="flex justify-between text-xs">
                                        <span className="font-bold text-neutral-600">{opt}</span>
                                        <span className="text-neutral-400 font-black">{count} ({pct}%)</span>
                                      </div>
                                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }} 
                                          animate={{ width: `${pct}%` }} 
                                          className="bg-blue-600 h-full rounded-full" 
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="space-y-3 pl-9">
                                {currentForm.responses.map((r, ri) => (
                                  <div key={ri} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 group hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{r.student}</span>
                                      <button className="text-[10px] font-bold text-neutral-400 hover:text-blue-600 flex items-center gap-1">
                                        <MessageSquare size={10} /> Feedback
                                      </button>
                                    </div>
                                    <p className="text-sm text-neutral-700 leading-relaxed">{r.answers[q.id] || <span className="italic text-neutral-300">Pas de réponse</span>}</p>
                                    {r.feedback && (
                                      <div className="mt-3 pt-3 border-t border-neutral-200/50">
                                        <p className="text-[10px] font-bold text-emerald-600 italic">Feedback : {r.feedback}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Vue principale (Liste des Questionnaires) ──────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 mb-4 font-black text-[10px] uppercase tracking-[0.2em] transition-colors">
              <ArrowLeft size={14} /> Tableau de bord
            </button>
            <h1 className="text-5xl font-black text-neutral-900 uppercase tracking-tighter leading-none mb-2">Suivi Matières</h1>
            <p className="text-neutral-500 font-medium">Consultez les réponses et gérez la diffusion de vos questionnaires.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Étudiants</p>
                  <p className="text-2xl font-black text-neutral-900">124</p>
                </div>
             </div>
          </div>
        </header>

        {questionnaires.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-neutral-200 p-20 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
              <ListTodo size={48} />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-4 uppercase tracking-tight">Aucun questionnaire assigné</h2>
            <p className="text-neutral-500 max-w-md mx-auto text-sm font-medium">
              Les questionnaires créés par l'administration pour vos matières apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {questionnaires.map((q) => (
                <motion.div 
                  layout 
                  key={q.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-white rounded-[2rem] border border-neutral-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div className={`h-32 relative p-6 flex flex-col justify-end ${q.sentToStudents ? 'bg-gradient-to-br from-emerald-600 to-emerald-500' : 'bg-gradient-to-br from-blue-700 to-blue-500'}`}>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleExport(q)} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white backdrop-blur-md" title="Exporter"><Download size={16} /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-2 bg-white/20 hover:bg-red-500/50 rounded-xl text-white backdrop-blur-md" title="Supprimer"><Trash2 size={16} /></button>
                    </div>
                    {q.sentToStudents && (
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
                        <CheckCircle2 size={10} /> En ligne
                      </div>
                    )}
                    <h3 className="text-white font-black text-xl truncate leading-tight tracking-tight">{q.title}</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-6 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={14} className="text-blue-500" />
                        <span className="text-neutral-900">{q.responses?.length || 0}</span> réponses
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => { setCurrentForm(q); setIsViewing(true); setActiveTab('responses'); }} 
                        className="w-full bg-neutral-900 text-white py-3.5 rounded-2xl font-black hover:bg-black transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-neutral-200"
                      >
                        <Eye size={16} /> Résultats & Feedbacks
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSendToStudents(q.id)} 
                          disabled={q.sentToStudents}
                          className={`flex-grow py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${
                            q.sentToStudents 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 cursor-default' 
                            : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200'
                          }`}
                        >
                          <Send size={14} /> 
                          {q.sentToStudents ? 'Publié' : 'Publier'}
                        </button>
                        <button onClick={() => copyLink(q.id)} className="px-4 bg-neutral-50 text-neutral-400 py-3.5 rounded-2xl font-bold hover:bg-neutral-100 transition-colors border border-neutral-100">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
