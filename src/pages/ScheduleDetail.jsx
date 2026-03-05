import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Printer, 
  Download, 
  Clock, 
  Calendar as CalendarIcon,
  Info,
  User,
  MapPin,
  BookOpen,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function ScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [days, setDays] = useState(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
  const [scheduleData, setScheduleData] = useState({});
  const [timeSlots, setTimeSlots] = useState([
    '08:30 - 10:00',
    '10:15 - 11:45',
    '13:30 - 15:00',
    '15:15 - 16:45'
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState(null);

  // Initialize empty grid
  useEffect(() => {
    const info = localStorage.getItem(`schedule_info_${id}`);
    if (info) setScheduleInfo(JSON.parse(info));

    const saved = localStorage.getItem(`schedule_${id}`);
    const savedSlots = localStorage.getItem(`schedule_slots_${id}`);
    const savedDays = localStorage.getItem(`schedule_days_${id}`);
    
    if (savedSlots) setTimeSlots(JSON.parse(savedSlots));
    if (savedDays) setDays(JSON.parse(savedDays));

    if (saved) {
      setScheduleData(JSON.parse(saved));
    } else {
      const initialData = {};
      const currentDays = savedDays ? JSON.parse(savedDays) : ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const currentSlots = savedSlots ? JSON.parse(savedSlots) : ['08:30 - 10:00', '10:15 - 11:45', '13:30 - 15:00', '15:15 - 16:45'];
      
      currentDays.forEach(day => {
        initialData[day] = {};
        currentSlots.forEach(slot => {
          initialData[day][slot] = [{ course: '', teacher: '', room: '', time: '' }];
        });
      });
      setScheduleData(initialData);
    }
  }, [id]);

  const [clipboard, setClipboard] = useState(null);

  const copyCell = (day, slot) => {
    const sessions = scheduleData[day]?.[slot] || [{ course: '', teacher: '', room: '', time: '' }];
    setClipboard(JSON.parse(JSON.stringify(sessions)));
    alert('Case copiée !');
  };

  const pasteCell = (day, slot) => {
    if (!clipboard) return;
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: JSON.parse(JSON.stringify(clipboard))
      }
    }));
  };

  const duplicateDay = (index) => {
    const dayToCopy = days[index];
    const newDayName = `${dayToCopy} (Copie)`;
    setDays([...days, newDayName]);
    setScheduleData(prev => ({
      ...prev,
      [newDayName]: JSON.parse(JSON.stringify(prev[dayToCopy] || {}))
    }));
  };

  const duplicateTimeSlot = (index) => {
    const slotToCopy = timeSlots[index];
    const newSlotName = `${slotToCopy} (Copie)`;
    setTimeSlots([...timeSlots, newSlotName]);
    setScheduleData(prev => {
      const newData = { ...prev };
      days.forEach(day => {
        if (newData[day] && newData[day][slotToCopy]) {
          newData[day][newSlotName] = JSON.parse(JSON.stringify(newData[day][slotToCopy]));
        }
      });
      return newData;
    });
  };

  const handleCellChange = (day, slot, sessionIndex, field, value) => {
    setScheduleData(prev => {
      const newData = { ...prev };
      if (!newData[day]) newData[day] = {};
      if (!newData[day][slot]) newData[day][slot] = [{ course: '', teacher: '', room: '', time: '' }];
      
      const sessions = [...newData[day][slot]];
      sessions[sessionIndex] = { ...sessions[sessionIndex], [field]: value };
      newData[day][slot] = sessions;
      
      return newData;
    });
  };

  const addSessionToCell = (day, slot) => {
    setScheduleData(prev => {
      const newData = { ...prev };
      if (!newData[day]) newData[day] = {};
      if (!newData[day][slot]) newData[day][slot] = [];
      newData[day][slot] = [...newData[day][slot], { course: '', teacher: '', room: '', time: '' }];
      return newData;
    });
  };

  const removeSessionFromCell = (day, slot, index) => {
    setScheduleData(prev => {
      const newData = { ...prev };
      if (newData[day] && newData[day][slot]) {
        newData[day][slot] = newData[day][slot].filter((_, i) => i !== index);
        if (newData[day][slot].length === 0) {
          newData[day][slot] = [{ course: '', teacher: '', room: '', time: '' }];
        }
      }
      return newData;
    });
  };

  const handleDayChange = (index, value) => {
    const oldDay = days[index];
    const newDays = [...days];
    newDays[index] = value;
    setDays(newDays);

    setScheduleData(prev => {
      const newData = { ...prev };
      if (newData[oldDay]) {
        newData[value] = newData[oldDay];
        delete newData[oldDay];
      }
      return newData;
    });
  };

  const addDay = () => {
    setDays([...days, 'Nouveau Jour']);
  };

  const removeDay = (index) => {
    const dayToRemove = days[index];
    setDays(days.filter((_, i) => i !== index));
    setScheduleData(prev => {
      const newData = { ...prev };
      delete newData[dayToRemove];
      return newData;
    });
  };

  const handleTimeSlotChange = (index, value) => {
    const oldSlot = timeSlots[index];
    const newSlots = [...timeSlots];
    newSlots[index] = value;
    setTimeSlots(newSlots);

    // Update data keys to match new slot name
    setScheduleData(prev => {
      const newData = { ...prev };
      DAYS.forEach(day => {
        if (newData[day] && newData[day][oldSlot]) {
          newData[day][value] = newData[day][oldSlot];
          delete newData[day][oldSlot];
        }
      });
      return newData;
    });
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, 'Nouveau créneau']);
  };

  const removeTimeSlot = (index) => {
    const slotToRemove = timeSlots[index];
    const newSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newSlots);
    
    setScheduleData(prev => {
      const newData = { ...prev };
      DAYS.forEach(day => {
        if (newData[day]) delete newData[day][slotToRemove];
      });
      return newData;
    });
  };

  const duplicateSession = (day, slot, sessionIndex) => {
    setScheduleData(prev => {
      const newData = { ...prev };
      const sessions = [...newData[day][slot]];
      const sessionToCopy = { ...sessions[sessionIndex] };
      newData[day][slot] = [...sessions, sessionToCopy];
      return newData;
    });
  };

  const clearCell = (day, slot) => {
    if (window.confirm('Voulez-vous vider cette case ?')) {
      setScheduleData(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: [{ course: '', teacher: '', room: '', time: '' }]
        }
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`schedule_${id}`, JSON.stringify(scheduleData));
    localStorage.setItem(`schedule_slots_${id}`, JSON.stringify(timeSlots));
    localStorage.setItem(`schedule_days_${id}`, JSON.stringify(days));
    setTimeout(() => {
      setIsSaving(false);
      alert('Emploi sauvegardé avec succès !');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 print:p-0 print:bg-white">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <button 
              onClick={() => navigate('/admin/schedules')}
              className="flex items-center text-neutral-500 hover:text-violet-600 mb-2 transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour à la liste</span>
            </button>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              Édition de l'Emploi
              <span className="text-sm font-normal px-3 py-1 bg-violet-100 text-violet-600 rounded-full">ID: {id}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={addDay}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm font-medium"
            >
              <Plus size={18} />
              Ajouter Jour
            </button>
            <button 
              onClick={addTimeSlot}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm font-medium"
            >
              <Plus size={18} />
              Ajouter Créneau
            </button>
            <button 
              onClick={handlePrint}
              className="p-3 bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isSaving 
                  ? 'bg-neutral-400 cursor-not-allowed' 
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20'
              }`}
            >
              <Save size={20} />
              {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </div>


        {/* Schedule Grid */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden print:shadow-none print:border-neutral-300">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-neutral-50 p-4 border-b border-r border-neutral-200 w-48 print:bg-white group relative">
                    <div className="flex flex-col items-center gap-1 text-neutral-400">
                      <Clock size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Horaires</span>
                    </div>
                    <button 
                      onClick={addTimeSlot}
                      className="absolute bottom-1 right-1 p-1 text-neutral-300 hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                      title="Ajouter un créneau"
                    >
                      <Plus size={14} />
                    </button>
                  </th>
                  {days.map((day, dayIdx) => (
                    <th key={dayIdx} className="bg-neutral-50 p-4 border-b border-r border-neutral-200 min-w-[250px] group relative print:bg-white">
                      <div className="flex flex-col items-center gap-1">
                        <CalendarIcon size={16} className="text-violet-500" />
                        <input
                          type="text"
                          className="w-full bg-transparent border-none text-center text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-violet-500 outline-none rounded print:focus:ring-0"
                          value={day}
                          onChange={(e) => handleDayChange(dayIdx, e.target.value)}
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => duplicateDay(dayIdx)}
                          className="p-1 bg-violet-100 text-violet-500 rounded-full hover:bg-violet-200 shadow-sm"
                          title="Dupliquer le jour"
                        >
                          <Plus size={10} />
                        </button>
                        <button 
                          onClick={() => removeDay(dayIdx)}
                          className="p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 shadow-sm"
                          title="Supprimer le jour"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="bg-neutral-50/50 p-4 border-b border-neutral-200 w-12 print:hidden">
                    <button 
                      onClick={addDay}
                      className="p-2 text-neutral-300 hover:text-violet-500 hover:bg-violet-50 rounded-full transition-all"
                      title="Ajouter un jour"
                    >
                      <Plus size={20} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30 print:bg-white'}>
                    <td className="p-4 border-b border-r border-neutral-200 text-center group relative">
                      <input
                        type="text"
                        className="w-full bg-neutral-100 border-none text-center text-xs font-bold text-neutral-600 px-2 py-2 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none print:bg-transparent"
                        value={slot}
                        onChange={(e) => handleTimeSlotChange(rowIndex, e.target.value)}
                      />
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => duplicateTimeSlot(rowIndex)}
                          className="p-1.5 bg-violet-100 text-violet-500 rounded-full hover:bg-violet-200 shadow-sm"
                          title="Dupliquer le créneau"
                        >
                          <Plus size={12} />
                        </button>
                        <button 
                          onClick={() => removeTimeSlot(rowIndex)}
                          className="p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 shadow-sm"
                          title="Supprimer le créneau"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                    {days.map(day => {
                      const sessions = scheduleData[day]?.[slot] || [{ course: '', teacher: '', room: '', time: '' }];
                      const isExam = scheduleInfo?.type === 'Examen';
                      return (
                        <td key={`${day}-${slot}`} className="p-3 border-b border-r border-neutral-200 group relative align-top">
                          <div className="flex flex-col gap-4">
                            {sessions.map((session, sIdx) => (
                              <div key={sIdx} className="relative p-3 bg-neutral-50 rounded-xl border border-neutral-100 group/session print:bg-white print:border-neutral-200">
                                <div className="flex flex-col gap-2">
                                  {/* Course Input */}
                                  <div className="flex items-center gap-2 bg-violet-50/50 p-2 rounded-lg border border-violet-100/50 focus-within:border-violet-300 transition-colors print:bg-transparent print:border-none">
                                    <BookOpen size={14} className={`${isExam ? 'text-red-500' : 'text-violet-500'} shrink-0`} />
                                    <input
                                      type="text"
                                      placeholder={isExam ? "Matière d'examen..." : "Cours..."}
                                      className="w-full bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder:text-neutral-300"
                                      value={session.course}
                                      onChange={(e) => handleCellChange(day, slot, sIdx, 'course', e.target.value)}
                                    />
                                  </div>
                                  
                                  {/* Time Input (Only for Exams) */}
                                  {isExam && (
                                    <div className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50 focus-within:border-amber-300 transition-colors print:bg-transparent print:border-none">
                                      <Clock size={14} className="text-amber-500 shrink-0" />
                                      <input
                                        type="text"
                                        placeholder="Heure (ex: 09:00 - 11:00)..."
                                        className="w-full bg-transparent outline-none text-xs text-neutral-600 placeholder:text-neutral-300 font-medium"
                                        value={session.time}
                                        onChange={(e) => handleCellChange(day, slot, sIdx, 'time', e.target.value)}
                                      />
                                    </div>
                                  )}

                                  {/* Teacher Input (Hide or rename for Exams) */}
                                  {!isExam && (
                                    <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 focus-within:border-blue-300 transition-colors print:bg-transparent print:border-none">
                                      <User size={14} className="text-blue-500 shrink-0" />
                                      <input
                                        type="text"
                                        placeholder="Enseignant..."
                                        className="w-full bg-transparent outline-none text-xs text-neutral-600 placeholder:text-neutral-300"
                                        value={session.teacher}
                                        onChange={(e) => handleCellChange(day, slot, sIdx, 'teacher', e.target.value)}
                                      />
                                    </div>
                                  )}

                                  {/* Room Input */}
                                  <div className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 focus-within:border-emerald-300 transition-colors print:bg-transparent print:border-none">
                                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                                    <input
                                      type="text"
                                      placeholder="Salle..."
                                      className="w-full bg-transparent outline-none text-xs text-neutral-600 placeholder:text-neutral-300"
                                      value={session.room}
                                      onChange={(e) => handleCellChange(day, slot, sIdx, 'room', e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/session:opacity-100 transition-opacity print:hidden">
                                  <button 
                                    onClick={() => duplicateSession(day, slot, sIdx)}
                                    className="p-1 bg-violet-100 text-violet-500 rounded-full hover:bg-violet-200 shadow-sm"
                                    title="Dupliquer"
                                  >
                                    <Plus size={10} />
                                  </button>
                                  {sessions.length > 1 && (
                                    <button 
                                      onClick={() => removeSessionFromCell(day, slot, sIdx)}
                                      className="p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 shadow-sm"
                                      title="Supprimer"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex gap-2 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => addSessionToCell(day, slot)}
                                className="flex-grow py-2 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
                                title="Ajouter une session"
                              >
                                <Plus size={14} />
                              </button>
                              <div className="flex flex-col gap-1">
                                <button 
                                  onClick={() => copyCell(day, slot)}
                                  className="p-1.5 border border-neutral-200 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                  title="Copier la case"
                                >
                                  <FileText size={12} />
                                </button>
                                <button 
                                  onClick={() => pasteCell(day, slot)}
                                  disabled={!clipboard}
                                  className={`p-1.5 border border-neutral-200 rounded-lg transition-all ${
                                    clipboard ? 'text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50' : 'text-neutral-200 cursor-not-allowed'
                                  }`}
                                  title="Coller la case"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button 
                                onClick={() => clearCell(day, slot)}
                                className="p-2 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Vider la case"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 flex flex-wrap gap-6 text-neutral-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Sauvegarde automatique locale activée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span>Format flexible ISIMS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
