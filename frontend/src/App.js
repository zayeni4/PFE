import React, { useState } from "react";

// ===== LOGIN PAGE =====
function Login({ onLogin }) {
  const [role, setRole] = useState("etudiant");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-900">
          Connexion
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <select
          className="w-full mb-6 p-3 border rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="etudiant">Étudiant</option>
          <option value="enseignant">Enseignant</option>
          <option value="chercheur">Chercheur</option>
          <option value="decideur">Décideur</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={() => onLogin(role)}
          className="w-full bg-indigo-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-800"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

// ===== GENERIC DASHBOARD LAYOUT =====
function Layout({ title, children, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-900 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold">{title}</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="p-6 grid gap-6">{children}</main>
    </div>
  );
}

// ===== ETUDIANT =====
function Etudiant({ onLogout }) {
  return (
    <Layout title="Espace Étudiant" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Répondre au questionnaire</h2>
        <textarea className="w-full border p-3 rounded-lg" rows={4} />
        <button className="mt-4 bg-indigo-900 text-white px-6 py-2 rounded-lg">
          Envoyer
        </button>
      </div>
    </Layout>
  );
}

// ===== ENSEIGNANT =====
function Enseignant({ onLogout }) {
  return (
    <Layout title="Espace Enseignant" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">Statistiques des étudiants</div>
    </Layout>
  );
}

// ===== CHERCHEUR =====
function Chercheur({ onLogout }) {
  return (
    <Layout title="Espace Chercheur" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">Analyse avancée des données</div>
    </Layout>
  );
}

// ===== DECIDEUR =====
function Decideur({ onLogout }) {
  return (
    <Layout title="Tableau de bord Décideur" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">Graphiques et indicateurs</div>
    </Layout>
  );
}

// ===== ADMIN =====
function Admin({ onLogout }) {
  return (
    <Layout title="Administration" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">Gestion utilisateurs & import CSV</div>
    </Layout>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [role, setRole] = useState(null);

  if (!role) return <Login onLogin={setRole} />;

  if (role === "etudiant") return <Etudiant onLogout={() => setRole(null)} />;
  if (role === "enseignant") return <Enseignant onLogout={() => setRole(null)} />;
  if (role === "chercheur") return <Chercheur onLogout={() => setRole(null)} />;
  if (role === "decideur") return <Decideur onLogout={() => setRole(null)} />;
  if (role === "admin") return <Admin onLogout={() => setRole(null)} />;
}