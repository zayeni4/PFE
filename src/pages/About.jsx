import React from 'react';
import { Target, Users, Award, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">{title}</h2>
    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">{subtitle}</p>
    <div className="w-20 h-1 bg-violet-600 mx-auto mt-6 rounded-full"></div>
  </div>
);

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = React.useState(0);
  const nodeRef = React.useRef(null);

  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/\D/g, ''));
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{value.includes('+') ? '+' : ''}</span>;
};

const About = () => {
  const stats = [
    { label: "Étudiants", value: "1200", sub: "L'année universitaire 2020/2021", icon: <Users className="w-10 h-10" /> },
    { label: "Enseignants", value: "112", sub: "L'année universitaire 2020/2021", icon: <Users className="w-10 h-10" /> },
    { label: "Diplômés depuis 2001", value: "4000", sub: "Depuis la création", icon: <Award className="w-10 h-10" /> },
    { label: "Partenaires", value: "12", sub: "Réseau mondial", icon: <Rocket className="w-10 h-10" /> },
  ];

  const partners = [
    { name: "Université de Tunis El Manar", logo: "🎓" },
    { name: "ISI Sfax", logo: "💻" },
    { name: "ENIT", logo: "⚙️" },
    { name: "FST", logo: "🔬" },
    { name: "ISG", logo: "📊" },
    { name: "IPT", logo: "🏥" },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8 text-violet-600" />,
      title: "Notre Mission",
      desc: "Accompagner les chercheurs et les professionnels vers l'excellence académique et technologique par un encadrement personnalisé."
    },
    {
      icon: <Rocket className="w-8 h-8 text-violet-600" />,
      title: "Notre Vision",
      desc: "Devenir le partenaire de référence en Tunisie pour l'innovation et la réussite des parcours doctoraux et professionnels."
    },
    {
      icon: <Award className="w-8 h-8 text-violet-600" />,
      title: "Nos Valeurs",
      desc: "Intégrité, rigueur scientifique, innovation constante et engagement total envers la réussite de nos partenaires."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-24 bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            À Propos de <span className="text-violet-500">2C-Services</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed"
          >
            Nous sommes une équipe d'experts passionnés par la transmission du savoir et l'accompagnement vers l'innovation.
          </motion.p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Notre Histoire</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Fondé avec la conviction que chaque projet de recherche mérite un encadrement de qualité, 2C-Services a évolué pour devenir un acteur clé du conseil académique et technologique en Tunisie.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Depuis nos débuts en 2001, nous avons aidé des milliers d'étudiants à structurer leurs mémoires et thèses, tout en accompagnant les entreprises dans leur transformation digitale et leurs besoins en R&D.
              </p>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
                alt="Team working" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-violet-600/10 rounded-full -z-10"></div>
            </motion.div>
          </div>

          <SectionHeading 
            title="Nos Valeurs Fondamentales" 
            subtitle="Ce qui nous guide au quotidien dans l'accompagnement de nos partenaires."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/30 border-y border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
              <span className="text-xl">📈</span> Tous les chiffres
            </div>
            <div className="flex-grow h-px bg-blue-200 dark:bg-blue-900/50"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-blue-900 dark:text-blue-400 mb-4">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-blue-900 dark:text-white mb-2">
                  <Counter value={stat.value} />
                </div>
                <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1">{stat.label}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-tighter">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Nos Partenaires" 
            subtitle="Nous collaborons avec les meilleures institutions pour garantir l'excellence."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{partner.logo}</div>
                <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 text-center uppercase tracking-tighter">{partner.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
