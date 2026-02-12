import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">AI Satisfaction</h1>
        <ul className="hidden md:flex gap-6 text-sm">
          <li className="hover:text-gray-200 cursor-pointer">Accueil</li>
          <li className="hover:text-gray-200 cursor-pointer">Questionnaires</li>
          <li className="hover:text-gray-200 cursor-pointer">Dashboard</li>
          <li className="hover:text-gray-200 cursor-pointer">À propos</li>
          <li className="hover:text-gray-200 cursor-pointer">Contact</li>
        </ul>
        <button className="bg-white text-blue-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-blue-800 text-white py-24 px-6 text-center">
        <h2 className="text-5xl font-bold mb-4">Analyse intelligente des enquêtes</h2>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Plateforme basée sur l'intelligence artificielle pour analyser la
          satisfaction des étudiants et aider les décideurs à prendre de
          meilleures décisions.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition">
            Répondre au questionnaire
          </button>
          <button className="border border-white px-6 py-3 rounded-2xl hover:bg-white hover:text-blue-900 transition">
            Voir le dashboard
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-8 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Collecte des réponses",
            desc: "Les étudiants remplissent des questionnaires en ligne facilement.",
          },
          {
            title: "Analyse IA",
            desc: "Machine Learning pour détecter tendances et satisfaction.",
          },
          {
            title: "Dashboard interactif",
            desc: "Graphiques dynamiques pour décideurs et chercheurs.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-900">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6 mt-12">
        <p>© 2026 - Plateforme IA d'analyse de satisfaction</p>
      </footer>
    </div>
  );
}
