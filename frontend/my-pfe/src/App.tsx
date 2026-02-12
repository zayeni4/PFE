import React, { useState } from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


// ===== LOGIN PAGE =====
function Login({ onLogin }: { onLogin: (role: string, email?: string) => void }) {
  const [role, setRole] = useState("etudiant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // هنا ممكن تربطها بعد ب API Django
    onLogin(role, email);
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-4 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleLogin}
          className="w-full bg-indigo-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-800"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

// ===== GENERIC LAYOUT =====
function Layout({ title, children, onLogout }: { title: string; children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-900 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold">{title}</h1>
        <button onClick={onLogout} className="bg-red-600 px-4 py-1 rounded">Logout</button>
      </header>
      <main className="p-6 grid gap-6">{children}</main>
    </div>
  );
}

// ===== ETUDIANT =====
function Etudiant({ onLogout }: { onLogout: () => void }) {
  const QUESTIONS = [
    { id: 1, text: "Comment évaluez-vous le cours ?" },
    { id: 2, text: "Suggestions pour améliorer ?" },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // هنا تربطها بعد ب API Django
    console.log("Réponses envoyées:", answers);
    alert("Réponses enregistrées !");
  };

  return (
    <Layout title="Espace Étudiant" onLogout={onLogout}>
      {QUESTIONS.map((q) => (
        <div key={q.id} className="bg-white p-4 rounded-xl shadow">
          <p className="mb-2 font-semibold">{q.text}</p>
          <textarea
            className="w-full border p-3 rounded-lg"
            rows={3}
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-indigo-900 text-white px-6 py-2 rounded-lg"
      >
        Envoyer
      </button>
    </Layout>
  );
}

// ===== ENSEIGNANT =====
function Enseignant({ onLogout }: { onLogout: () => void }) {
  return (
    <Layout title="Espace Enseignant" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">Statistiques des étudiants (à connecter au backend)</div>
    </Layout>
  );
}

// ===== CHERCHEUR =====
function Chercheur({ onLogout }: { onLogout: () => void }) {
  const [results, setResults] = useState("");

  const runAnalysis = () => {
    // بعد API Django ML
    setResults("Résultat de l'analyse ML");
  };

  return (
    <Layout title="Espace Chercheur" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow mb-4">
        <button
          onClick={runAnalysis}
          className="bg-indigo-900 text-white px-6 py-2 rounded-lg"
        >
          Lancer l'analyse
        </button>
      </div>
      {results && <div className="bg-gray-100 p-4 rounded">{results}</div>}
    </Layout>
  );
}

// ===== DECIDEUR =====


function Decideur({ onLogout }: { onLogout: () => void }) {
  const data = [
    { name: "Question 1", Réponses: 40 },
    { name: "Question 2", Réponses: 30 },
    { name: "Question 3", Réponses: 20 },
  ];

  return (
    <Layout title="Espace Décideur" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Tableau de bord</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Réponses" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

// ===== ADMIN =====
function Admin({ onLogout }: { onLogout: () => void }) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Fichier sélectionné:", file.name);
      alert("Fichier importé !");
    }
  };

  return (
    <Layout title="Admin" onLogout={onLogout}>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Gestion des questionnaires</h2>
        <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />
        <button className="mt-4 bg-indigo-900 text-white px-6 py-2 rounded-lg">
          Importer
        </button>
      </div>
    </Layout>
  );
}

// ===== APP PRINCIPAL =====
export default function App() {
  const [role, setRole] = useState<string | null>(null);

  const handleLogout = () => setRole(null);

  const handleLogin = (selectedRole: string) => setRole(selectedRole);

  if (!role) return <Login onLogin={handleLogin} />;

  switch (role) {
    case "etudiant":
      return <Etudiant onLogout={handleLogout} />;
    case "enseignant":
      return <Enseignant onLogout={handleLogout} />;
    case "chercheur":
      return <Chercheur onLogout={handleLogout} />;
    case "decideur":
      return <Decideur onLogout={handleLogout} />;
    case "admin":
      return <Admin onLogout={handleLogout} />;
    default:
      return <Login onLogin={handleLogin} />;
  }
}
