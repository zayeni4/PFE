import React, { useState } from "react";

type Props = {
  onLogin: (email: string, password: string) => void;
};

export function LoginEtudiant({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(email, password); // هنا تربطها بعد بـ API Django
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-900">
          Connexion Étudiant
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
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-800"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
