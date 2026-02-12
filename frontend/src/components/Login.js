import React, { useState } from 'react';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('etudiant');

  const handleLogin = () => {
    const user = { username, role };
    setUser(user);
    alert(`Connecté en tant que ${role}`);
  };

  return (
    <div>
      <h2>Login</h2>
      Username: <input value={username} onChange={e=>setUsername(e.target.value)} /><br/>
      Role: 
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="etudiant">Etudiant</option>
        <option value="enseignant">Enseignant</option>
        <option value="chercheur">Chercheur</option>
        <option value="decideur">Décideur</option>
        <option value="admin">Admin</option>
      </select><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
