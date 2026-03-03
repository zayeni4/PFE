import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Home, ChevronRight, Linkedin, Youtube, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'NOUVEAUTÉS', href: '/news' },
  { 
    label: "L'INSTITUT", 
    href: '/about',
    megaMenu: {
      featured: {
        title: "Présentation de l'ISIMS",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400",
        link: "/presentation"
      },
      columns: [
        {
          title: "Organisation",
          links: ["Mot du Directeur", "Conseil Scientifique", "Organigramme", "Services Administratifs"]
        },
        {
          title: "Qualité",
          links: ["Cellule Qualité", "Auto-évaluation", "Accréditation", "Rapports Annuels"]
        },
        {
          title: "Accès",
          links: ["Plan d'accès", "Contact", "Galerie Photos"]
        }
      ]
    }
  },
  { 
    label: 'DÉPARTEMENTS', 
    href: '/departments',
    megaMenu: {
      featured: {
        title: "Nos Départements",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
        link: "/departments"
      },
      columns: [
        {
          title: "Informatique",
          links: ["Génie Logiciel", "Systèmes et Réseaux", "Data Science", "Intelligence Artificielle"]
        },
        {
          title: "Multimédia",
          links: ["Design Graphique", "Audiovisuel", "Jeux Vidéo", "Réalité Virtuelle"]
        },
        {
          title: "Sciences de Base",
          links: ["Mathématiques", "Physique", "Langues et Soft Skills"]
        }
      ]
    }
  },
  { 
    label: 'FORMATION ET RECHERCHE', 
    href: '/services',
    megaMenu: {
      featured: {
        title: "Laboratoire de Recherche",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
        link: "/research-lab"
      },
      columns: [
        {
          title: "Licences",
          links: ["Cycle préparatoire intégré", "Cycle Ingénieur", "Candidature Mastère"]
        },
        {
          title: "MASTÈRES DE RECHERCHE",
          links: ["SCIENCES DE L'INFORMATIQUE (SI)", "ENTERPRISE SYSTEM ENGINEERING (ESE)", "DATA SCIENCE (DS)", "SCIENCE ON CYBER PHYSICAL SYSTEMS"]
        },
        {
          title: "MASTÈRES PROFESSIONNELS",
          links: ["INNOVATION ET GESTION DE PROJETS (IGP)", "DESIGN D'EXPERIENCE ET DESIGN D'INTERFACE (DEDI)"]
        }
      ]
    }
  },
  { label: 'VIE ESTUDIANTINE', href: '/student-life' },
  { label: 'PROJETS', href: '/projects' },
  { label: 'PARTENARIAT', href: '/partnerships' },
  { label: "APPELS D'OFFRE ET CONSULTATIONS", href: '/tenders' },
  { label: "ABOUT US", href: '/about' },
];

const MegaMenu = ({ content, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute left-0 w-full bg-white dark:bg-neutral-900 shadow-2xl border-t border-neutral-100 dark:border-neutral-800 z-50 mt-0"
      >
        <div className="container mx-auto px-6 py-10 grid grid-cols-12 gap-8">
          {/* Featured Section */}
          <div className="col-span-3 border-r border-neutral-100 dark:border-neutral-800 pr-8">
            <div className="relative rounded-xl overflow-hidden group cursor-pointer">
              <img src={content.featured.image} alt={content.featured.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
                <h3 className="text-white font-bold text-xl leading-tight">{content.featured.title}</h3>
              </div>
            </div>
            <button className="mt-4 text-xs font-bold bg-neutral-900 text-white px-4 py-2 rounded uppercase hover:bg-violet-600 transition-colors">
              Lire la suite
            </button>
          </div>

          {/* Columns */}
          <div className="col-span-9 grid grid-cols-3 gap-8">
            {content.columns.map((col, idx) => (
              <div key={idx} className={idx !== 0 ? "border-l border-neutral-100 dark:border-neutral-800 pl-8" : ""}>
                <h4 className="text-blue-900 dark:text-blue-400 font-black text-sm uppercase mb-6 tracking-wider">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2 group cursor-pointer">
                      <ChevronRight className="w-4 h-4 text-blue-900 dark:text-blue-400 mt-0.5 group-hover:translate-x-1 transition-transform" />
                      <span className="text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      {/* Top Bar with Search */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto px-4 h-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="Rechercher ..." 
                className="w-full bg-[#f2f2f2] dark:bg-neutral-800 border-none rounded-none py-2.5 px-4 pr-12 text-sm focus:outline-none focus:ring-0 text-neutral-600 dark:text-white placeholder-neutral-400"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="flex justify-between items-center h-14">
          {/* Home Icon & Main Nav */}
          <div className="flex items-center">
            <Link to="/" className="text-[#00a6eb] hover:scale-110 transition-transform px-4 border-l border-neutral-100 dark:border-neutral-800 h-14 flex items-center">
              <Home className="w-5 h-5 fill-current" />
            </Link>

            <ul className="hidden lg:flex items-center h-14">
              {navItems.map((item, index) => (
                <li 
                  key={index} 
                  className="relative h-14 flex items-center border-l border-neutral-100 dark:border-neutral-800 last:border-r"
                  onMouseEnter={() => item.megaMenu && setActiveMegaMenu(index)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link 
                    to={item.href} 
                    className={`px-4 text-[11px] font-bold uppercase tracking-tight transition-colors ${
                      activeMegaMenu === index ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-300 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.megaMenu && <MegaMenu content={item.megaMenu} isOpen={activeMegaMenu === index} />}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden lg:block py-1.5 px-4 bg-blue-900 text-white rounded text-xs font-bold hover:bg-blue-800 transition-colors"
            >
              ESPACE ENTREPRISE
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden py-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-6"
            >
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 uppercase"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="text-center bg-blue-900 text-white py-3 rounded text-xs font-bold uppercase"
                onClick={() => setMenuOpen(false)}
              >
                ESPACE ENTREPRISE
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
