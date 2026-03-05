import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import SignInPage from './pages/SignInPage';
import Contact from './pages/Contact';
import About from './pages/About';
import Footer from './components/Footer';
import MapSection from './components/MapSection';
import HeroSection from './components/HeroSection'; 
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ScheduleManagement from './pages/ScheduleManagement';
import ScheduleDetail from './pages/ScheduleDetail';
import { ThemeProvider } from './context/ThemeContext';

// Placeholder for missing logo.png to avoid build errors
const logo = "https://images.unsplash.com/photo-1592288337612-ca072f93b1bb?auto=format&fit=crop&q=80&w=200";

const Home = () => (
  <div className="min-h-screen">
    <div className="bg-white dark:bg-neutral-950 py-10 px-6 border-b border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center p-4 shrink-0 border border-blue-100 dark:border-blue-800">
          <img 
            src={logo}
            alt="ISIMS Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-blue-900 dark:text-white mb-2 leading-tight uppercase tracking-tighter">
            2C-Services
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <p className="text-lg md:text-xl font-medium text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
              Leading the way in news research
            </p>
            <div className="hidden md:block w-px h-6 bg-neutral-200 dark:bg-neutral-800"></div>
            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">
              Université de ..
            </p>
          </div>
        </div>
      </div>
    </div>

    <HeroSection />

    {/* Partners Marquee */}
    <div className="py-12 bg-neutral-50 dark:bg-neutral-900/30 border-b border-neutral-100 dark:border-neutral-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h3 className="text-center text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Nos Partenaires Académiques & Industriels</h3>
      </div>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <div className="text-3xl">🏢</div>
            <span className="font-bold text-neutral-400 uppercase text-xs tracking-tighter">Partner {i}</span>
          </div>
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={`dup-${i}`} className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <div className="text-3xl">🏢</div>
            <span className="font-bold text-neutral-400 uppercase text-xs tracking-tighter">Partner {i}</span>
          </div>
        ))}
      </div>
    </div>

    {/* News & Events Section */}
    <div className="py-24 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-blue-900 dark:text-white uppercase tracking-tighter">
            Actualités & Événements
          </h2>
          <button className="text-blue-600 font-bold text-sm hover:underline">
            Voir tout →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              date: "25 Fév 2026",
              title: "Ouverture des candidatures pour les Mastères 2026/2027",
              desc: "Les étudiants intéressés peuvent désormais soumettre leurs dossiers en ligne via la plateforme dédiée.",
              tag: "Admission"
            },
            {
              date: "12 Mars 2026",
              title: "Séminaire sur l'Intelligence Artificielle Générative",
              desc: "Un événement exceptionnel réunissant des experts du domaine pour discuter des dernières avancées.",
              tag: "Événement"
            },
            {
              date: "05 Avr 2026",
              title: "Nouveau partenariat avec une université européenne",
              desc: "L'ISIMS renforce sa dimension internationale avec un nouvel accord de double diplôme.",
              tag: "Partenariat"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 transition-all shadow-sm hover:shadow-xl">
                <div className="h-48 bg-neutral-200 dark:bg-neutral-800 relative">
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {item.tag}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-neutral-500 mb-2 font-bold">{item.date}</div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">Pourquoi choisir 2C-Services ?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Nous offrons une expertise inégalée pour accompagner les étudiants et les professionnels dans leur parcours de recherche et d'innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: "Expertise", desc: "Des décennies d'expérience combinée dans divers domaines de recherche." },
            { title: "Innovation", desc: "Des solutions de pointe adaptées à vos besoins spécifiques et académiques." },
            { title: "Fiabilité", desc: "Des résultats constants sur lesquels vous pouvez compter à chaque étape." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <MapSection />
    <div className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "📚", label: "Bibliothèque" },
            { icon: "📧", label: "Webmail" },
            { icon: "🖥️", label: "E-Learning" },
            { icon: "📅", label: "Emploi du temps" }
          ].map((link, i) => (
            <motion.a 
              key={i}
              href="#"
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <span className="text-4xl">{link.icon}</span>
              <span className="font-bold uppercase tracking-wider text-xs">{link.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Placeholder = ({ title }) => (
  <div className="min-h-screen pt-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">{title}</h1>
      <p className="text-neutral-600 dark:text-neutral-400">This is a placeholder page for {title.toLowerCase()}.</p>
    </div>
  </div>
);

const DashboardRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "Etudiant") {
      navigate("/student-dashboard");
    } else if (role === "Enseignant") {
      navigate("/teacher-dashboard");
    } else if (role === "Administration") {
      navigate("/admin-dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/dashboard') || 
                        location.pathname.startsWith('/profile') ||
                        location.pathname.endsWith('-dashboard') ||
                        location.pathname.startsWith('/admin/schedules');
  const isLoginPage = location.pathname === '/login';
  const shouldHideNav = isProfilePage || isLoginPage;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300">
      {!shouldHideNav && <NavBar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Placeholder title="Our Services" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} /> 
          <Route path="/profile" element={<DashboardRedirect />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/schedules" element={<ScheduleManagement />} />
          <Route path="/admin/schedules/:id" element={<ScheduleDetail />} />
        </Routes>
      </main>
      {!shouldHideNav && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
