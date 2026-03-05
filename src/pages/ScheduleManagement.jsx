import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  Users, 
  ChevronLeft,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('schedules_list');
    return saved ? JSON.parse(saved) : [
      { id: 1, class: 'L1-Informatique', type: 'Cours', title: 'Emploi S1', date: '2024-01-15' },
      { id: 2, class: 'L2-Multimedia', type: 'Examen', title: 'Session Principale', date: '2024-02-20' },
      { id: 3, class: 'M1-Cyber', type: 'Cours', title: 'Emploi S2', date: '2024-02-01' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('schedules_list', JSON.stringify(schedules));
    // Also save individual info for detail page
    schedules.forEach(s => {
      localStorage.setItem(`schedule_info_${s.id}`, JSON.stringify(s));
    });
  }, [schedules]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    class: '',
    type: 'Cours',
    title: '',
  });

  const handleDuplicate = (schedule) => {
    const duplicated = {
      ...schedule,
      id: Date.now(),
      title: `${schedule.title} (Copie)`,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Also duplicate the data in localStorage
    const savedData = localStorage.getItem(`schedule_${schedule.id}`);
    const savedSlots = localStorage.getItem(`schedule_slots_${schedule.id}`);
    const savedDays = localStorage.getItem(`schedule_days_${schedule.id}`);
    
    if (savedData) localStorage.setItem(`schedule_${duplicated.id}`, savedData);
    if (savedSlots) localStorage.setItem(`schedule_slots_${duplicated.id}`, savedSlots);
    if (savedDays) localStorage.setItem(`schedule_days_${duplicated.id}`, savedDays);

    setSchedules([duplicated, ...schedules]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet emploi ?')) {
      setSchedules(schedules.filter(s => s.id !== id));
      localStorage.removeItem(`schedule_${id}`);
      localStorage.removeItem(`schedule_slots_${id}`);
      localStorage.removeItem(`schedule_days_${id}`);
      localStorage.removeItem(`schedule_info_${id}`);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newSchedule.class || !newSchedule.title) return;

    const schedule = {
      id: Date.now(),
      ...newSchedule,
      date: new Date().toISOString().split('T')[0]
    };

    setSchedules([schedule, ...schedules]);
    setIsModalOpen(false);
    setNewSchedule({ class: '', type: 'Cours', title: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center text-neutral-500 hover:text-violet-600 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Retour au tableau de bord</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Gestion des Emplois</h1>
            <p className="text-neutral-500">Créez et gérez les emplois du temps et d'examens.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20"
          >
            <Plus size={20} />
            Nouvel Emploi
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-grow flex items-center bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2">
            <Search size={18} className="text-neutral-400" />
            <input 
              type="text" 
              placeholder="Rechercher par classe ou titre..." 
              className="bg-transparent outline-none px-3 w-full text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-violet-500">
              <option>Tous les types</option>
              <option>Cours</option>
              <option>Examen</option>
            </select>
            <button className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500 hover:text-violet-600 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {schedules.map((schedule) => (
              <motion.div 
                key={schedule.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    schedule.type === 'Examen' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {schedule.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDuplicate(schedule)}
                      className="text-neutral-300 hover:text-violet-600 transition-colors p-1"
                      title="Dupliquer"
                    >
                      <Plus size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="text-neutral-300 hover:text-red-600 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 mb-1">{schedule.title}</h3>
                <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
                  <Users size={14} />
                  <span>{schedule.class}</span>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Créé le {schedule.date}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/admin/schedules/${schedule.id}`)}
                    className="text-violet-600 font-bold hover:underline"
                  >
                    Voir détails
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {schedules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Aucun emploi trouvé</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-violet-600 hover:underline font-bold"
            >
              Créer le premier emploi
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Nouvel Emploi</h2>
                    <p className="text-sm text-neutral-500">Remplissez les informations ci-dessous.</p>
                  </div>
                </div>

                <form onSubmit={handleCreate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Titre de l'emploi</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Emploi du temps S1"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition-colors"
                      value={newSchedule.title}
                      onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Classe / Groupe</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: L1-Informatique"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition-colors"
                      value={newSchedule.class}
                      onChange={(e) => setNewSchedule({...newSchedule, class: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Type d'emploi</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setNewSchedule({...newSchedule, type: 'Cours'})}
                        className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          newSchedule.type === 'Cours' 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-neutral-50 text-neutral-500 border border-neutral-200'
                        }`}
                      >
                        <BookOpen size={16} />
                        Cours
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewSchedule({...newSchedule, type: 'Examen'})}
                        className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          newSchedule.type === 'Examen' 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                            : 'bg-neutral-50 text-neutral-500 border border-neutral-200'
                        }`}
                      >
                        <FileText size={16} />
                        Examen
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 rounded-xl font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition-all"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
