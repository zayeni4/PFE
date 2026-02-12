import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function DashboardDecideur() {
  const [reponses, setReponses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/reponses/').then(res => setReponses(res.data));
  }, []);

  const counts = {};
  reponses.forEach(r => counts[r.texte] = (counts[r.texte] || 0) + 1);

  const data = {
    labels: Object.keys(counts),
    datasets: [{ label: 'Réponses', data: Object.values(counts), backgroundColor: 'rgba(75,192,192,0.6)' }]
  };

  return <Bar data={data} />;
}

export default DashboardDecideur;
