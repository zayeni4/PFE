import React from "react";

const instituts = [

];

const facultes = [

];

const ecoles = [
];

const NavItem = ({ label }) => (
  <li className="flex items-start gap-2 group cursor-pointer">
    <span className="text-red-600 mt-1 text-xs leading-none">▸</span>
    <span className="text-gray-300 text-sm leading-snug group-hover:text-white transition-colors duration-200">
      {label}
    </span>
  </li>
);

const SocialBtn = ({ icon }) => (
  <button className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:border-red-500 hover:text-white hover:bg-red-600 transition-all duration-300 text-sm">
    {icon}
  </button>
);

export default function UTMFooter() {
  return (
    <footer className="bg-[#111111] text-white font-sans border-t border-neutral-800">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2
          className="text-2xl font-light text-white mb-10 tracking-wide"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Université de Tunis El Manar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Instituts */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold tracking-widest text-white mb-5 uppercase border-b border-gray-700 pb-2">
              Instituts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <ul className="space-y-3">
                {instituts.slice(0, 5).map((item) => (
                  <NavItem key={item} label={item} />
                ))}
              </ul>
              <ul className="space-y-3">
                {instituts.slice(5).map((item) => (
                  <NavItem key={item} label={item} />
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Facultés */}
            <div>
              <h3 className="text-xs font-bold tracking-widest text-white mb-5 uppercase border-b border-gray-700 pb-2">
                Facultés
              </h3>
              <ul className="space-y-3">
                {facultes.map((item) => (
                  <NavItem key={item} label={item} />
                ))}
              </ul>
            </div>

            {/* Écoles */}
            <div>
              <h3 className="text-xs font-bold tracking-widest text-white mb-5 uppercase border-b border-gray-700 pb-2">
                Écoles
              </h3>
              <ul className="space-y-3">
                {ecoles.map((item) => (
                  <NavItem key={item} label={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle contact section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs text-center leading-tight px-1">🎓 UTM</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex-1 min-w-52">
            <p className="flex items-start gap-2 text-sm text-gray-300 mb-1">
              <span className="text-red-500 mt-1">📍</span>
              <span>
                Université de Tunis El Manar, Campus Universitaire Farhat Hached, Tunis
              </span>
            </p>
          </div>

          {/* Contact info */}
          <div className="flex-1 min-w-48 space-y-1">
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-red-500">📞</span>
              <span>Tél : (+216) 71 873 366</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-red-500">🖨</span>
              <span>Fax : (+216) 71 872 055</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-red-500">✉️</span>
              <span>
                Email :{" "}
                <a href="mailto:utm@utm.tn" className="font-semibold text-white hover:text-red-400 transition-colors">
                 utm@utm.tn
                </a>
              </span>
            </p>
          </div>

          {/* Social links */}
          <div className="flex gap-2">
            <SocialBtn icon="✉" />
            <SocialBtn icon="f" />
            <SocialBtn icon="in" />
            <SocialBtn icon="▶" />
            <SocialBtn icon="📍" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-1 text-sm text-gray-400">
            {["Actualités", "Événements", "Contacts", "Plan du Site"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-1">
                <a href="#" className="hover:text-white transition-colors duration-200">
                  {item}
                </a>
                {i < arr.length - 1 && <span className="text-gray-600 ml-1">|</span>}
              </span>
            ))}
          </nav>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} 2C Services </p>
        </div>
      </div>
    </footer>
  );
}
