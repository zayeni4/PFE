import React from 'react';

import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Heading = ({ title1, title2 }) => (
  <div className="text-center mb-10">
    <h2 className="text-4xl font-black text-blue-900 dark:text-white uppercase tracking-tighter">
      {title1} <span className="text-blue-600">{title2}</span>
    </h2>
    <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
  </div>
);

const Contact = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <Heading title1="Contactez" title2="Nous" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-8 uppercase tracking-wider">Nos Coordonnées</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase">Adresse</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      Route de Tunis km 10, <br />
                      Technopôle de Sfax, Tunisie
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase">Téléphone</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      +216 74 862 500
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase">Email</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      contact@isims.usf.tn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="userName" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      Votre Nom
                    </label>
                    <input 
                      className="py-3.5 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
                      type="text" 
                      name="userName" 
                      id="userName" 
                      placeholder="Entrez votre nom" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="userEmail" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      Votre Email
                    </label>
                    <input 
                      className="py-3.5 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
                      type="email" 
                      name="userEmail" 
                      id="userEmail" 
                      placeholder="Entrez votre email" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="userSubject" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    Sujet
                  </label>
                  <input 
                    className="py-3.5 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
                    type="text" 
                    name="userSubject" 
                    id="userSubject" 
                    placeholder="Sujet de votre message" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="userMessage" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    Votre Message
                  </label>
                  <textarea 
                    className="py-3.5 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
                    name="userMessage" 
                    id="userMessage" 
                    placeholder="Comment pouvons-nous vous aider ?" 
                    rows="5"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    className="w-full md:w-auto px-10 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 uppercase text-sm tracking-widest" 
                    type="submit"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
