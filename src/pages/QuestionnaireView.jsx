import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  AlertCircle,
  ArrowLeft,
  FileUp,
  FileText,
  X
} from 'lucide-react';

export default function QuestionnaireView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('questionnaires');
    if (saved) {
      const all = JSON.parse(saved);
      const found = all.find(q => q.id === id);
      if (found) {
        setQuestionnaire(found);
        // Initialize answers
        const initialAnswers = {};
        found.questions.forEach(q => {
          initialAnswers[q.id] = q.type === 'choice' ? '' : '';
        });
        setAnswers(initialAnswers);
      } else {
        setError("Questionnaire non trouvé");
      }
    }
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleFileUpload = async (questionId, file) => {
    if (!file) return;
    
    // In a real app, you'd upload to a server. 
    // Here we convert to base64 for demo purposes (localStorage limit applies)
    const reader = new FileReader();
    reader.onload = (e) => {
      handleAnswerChange(questionId, {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required questions
    const missingRequired = questionnaire.questions.filter(q => q.required && !answers[q.id]);
    if (missingRequired.length > 0) {
      alert(`Veuillez répondre à toutes les questions obligatoires.`);
      return;
    }

    // Save response
    const saved = localStorage.getItem('questionnaires');
    if (saved) {
      const all = JSON.parse(saved);
      const updated = all.map(q => {
        if (q.id === id) {
          const newResponse = {
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            answers: answers
          };
          return {
            ...q,
            responses: [...(q.responses || []), newResponse]
          };
        }
        return q;
      });
      localStorage.setItem('questionnaires', JSON.stringify(updated));
    }

    setIsSubmitted(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-200 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">{error}</h2>
          <p className="text-neutral-500 mb-6">Le lien que vous avez suivi est peut-être expiré ou incorrect.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!questionnaire) return null;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl border border-neutral-200 text-center max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4 uppercase tracking-tighter">Merci !</h2>
          <p className="text-neutral-600 mb-8 text-lg">Votre réponse a été enregistrée avec succès.</p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Retour à l'accueil
            </button>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-neutral-100 text-neutral-600 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-all"
            >
              Envoyer une autre réponse
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-sm border-t-8 border-t-blue-600 border border-neutral-200 overflow-hidden">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl font-black text-neutral-900 mb-4 uppercase tracking-tighter leading-tight">
                {questionnaire.title}
              </h1>
              <p className="text-neutral-600 text-lg leading-relaxed">
                {questionnaire.description}
              </p>
              <div className="mt-8 flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {questionnaire.questions.length} Questions
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span>Temps estimé : 2 min</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          {questionnaire.questions.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 md:p-10"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-blue-600/20">{index + 1}</span>
                  {q.required && <span className="text-red-500 font-bold text-xl">*</span>}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6 leading-snug">
                    {q.title}
                  </h3>

                  {q.type === 'choice' && (
                    <div className="space-y-3">
                      {q.options.map((option, optIdx) => (
                        <label 
                          key={optIdx}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                            answers[q.id] === option 
                              ? 'border-blue-600 bg-blue-50 text-blue-900' 
                              : 'border-neutral-100 hover:border-neutral-200 text-neutral-600'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            answers[q.id] === option 
                              ? 'border-blue-600 bg-blue-600' 
                              : 'border-neutral-300 group-hover:border-neutral-400'
                          }`}>
                            {answers[q.id] === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                          <input 
                            type="radio"
                            name={q.id}
                            value={option}
                            checked={answers[q.id] === option}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="hidden"
                          />
                          <span className="font-bold text-sm uppercase tracking-wide">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <input 
                      type="text"
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Votre réponse..."
                      className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                    />
                  )}

                  {q.type === 'paragraph' && (
                    <textarea 
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Votre réponse détaillée..."
                      className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium min-h-[120px] resize-none"
                    />
                  )}

                  {q.type === 'date' && (
                    <input 
                      type="date"
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                    />
                  )}

                  {q.type === 'file' && (
                    <div className="space-y-4">
                      {!answers[q.id] ? (
                        <label className="w-full border-2 border-dashed border-neutral-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
                          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                            <FileUp size={32} />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-neutral-900">Cliquez pour télécharger</p>
                            <p className="text-sm text-neutral-500">Tous types de fichiers (PDF, Image, Doc...)</p>
                          </div>
                          <input 
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(q.id, e.target.files[0])}
                          />
                        </label>
                      ) : (
                        <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                              <FileText size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-blue-900 truncate max-w-[200px]">{answers[q.id].name}</p>
                              <p className="text-xs text-blue-600">{(answers[q.id].size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleAnswerChange(q.id, null)}
                            className="p-2 hover:bg-blue-200 rounded-full text-blue-600 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex items-center justify-between pt-8">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Ne soumettez jamais de mots de passe via ce formulaire.
            </p>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 uppercase tracking-tighter"
            >
              Envoyer
              <Send size={20} />
            </button>
          </div>
        </form>

        <footer className="mt-20 text-center pb-12">
          <div className="flex items-center justify-center gap-2 text-neutral-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            <span>Propulsé par</span>
            <span className="text-blue-600">2C-Services Forms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
