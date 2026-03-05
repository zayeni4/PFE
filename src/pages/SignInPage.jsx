import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, RotateCw, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function drawCaptcha(canvas, code) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200},0.5)`;
        ctx.fill();
    }

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.strokeStyle = `rgba(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200},0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const charWidth = width / (code.length + 1);
    code.split("").forEach((char, i) => {
        ctx.save();
        ctx.translate(charWidth * (i + 0.8), height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.6);
        ctx.font = `bold ${24 + Math.random() * 8}px monospace`;
        ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 180)})`;
        ctx.fillText(char, 0, 8);
        ctx.restore();
    });
}

export default function SignInPage() {
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaCode, setCaptchaCode] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("Etudiant");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();

    const refreshCaptcha = () => {
        const newCode = generateCaptcha();
        setCaptchaCode(newCode);
        setCaptchaInput("");
        setError("");
    };

    useEffect(() => {
        refreshCaptcha();
    }, []);

    useEffect(() => {
        if (canvasRef.current && captchaCode) {
            drawCaptcha(canvasRef.current, captchaCode);
        }
    }, [captchaCode]);

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!login.trim() || !password.trim()) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        if (captchaInput !== captchaCode) {
            setError("Captcha incorrect. Veuillez réessayer.");
            refreshCaptcha();
        } else {
            setError("");
            // Save the login name and role to localStorage
            localStorage.setItem("userName", login);
            localStorage.setItem("userRole", role);
            
            // Redirect based on role
            if (role === "Etudiant") {
                navigate("/student-dashboard");
            } else if (role === "Enseignant") {
                navigate("/teacher-dashboard");
            } else {
                navigate("/admin-dashboard");
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 relative">
            {/* Theme Toggle for Login Page */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-full bg-white dark:bg-neutral-900 shadow-lg border border-gray-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:scale-110 transition-transform"
                    aria-label="Toggle theme"
                >
                    {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            </div>

            {/* Formulaire de gauche */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-neutral-900 px-8 py-12 rounded-3xl border-2 border-gray-100 dark:border-neutral-800 shadow-xl transition-colors duration-300">
                        <div className="flex items-center mb-8">
                            <Link to="/" className="flex items-center group">
                                <div className="bg-violet-600 p-2 rounded-lg mr-2 group-hover:bg-violet-700 transition-colors">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">2C-Services</span>
                            </Link>
                        </div>

                        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Se connecter</h1>
                        <p className="font-medium text-lg text-gray-500 dark:text-neutral-400 mt-2">Veuillez entrer vos détails.</p>

                        {/* Sélecteur de rôle */}
                        <div className="mt-8 flex rounded-xl border-2 border-gray-100 dark:border-neutral-800 overflow-hidden">
                            {["Etudiant", "Enseignant", "Administration"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-3 text-sm font-bold transition-all duration-200
                                        ${role === r
                                            ? "bg-violet-600 text-white"
                                            : "bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                            {/* Login */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Login</label>
                                <input
                                    className="w-full border-2 border-gray-100 dark:border-neutral-800 rounded-xl p-4 bg-transparent outline-none focus:border-violet-500 dark:text-white transition-colors"
                                    placeholder="votre login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Mot de passe</label>
                                <input
                                    className="w-full border-2 border-gray-100 dark:border-neutral-800 rounded-xl p-4 bg-transparent outline-none focus:border-violet-500 dark:text-white transition-colors"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Options de connexion */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <input type="checkbox" id="remember" className="rounded border-gray-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 bg-transparent" />
                                    <label className="ml-2 font-medium text-sm text-neutral-700 dark:text-neutral-300" htmlFor="remember">Rester connecté</label>
                                </div>
                                <button type="button" className="font-bold text-sm text-violet-600 hover:underline">Mot de passe oublié ?</button>
                            </div>

                            {/* CAPTCHA */}
                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Vérification</label>
                                <div className="w-full flex items-center border-2 border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden">
                                    <input
                                        className="flex-1 p-4 bg-transparent outline-none text-sm dark:text-white"
                                        placeholder="Entrez le code"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        width={120}
                                        height={55}
                                        className="border-l-2 border-gray-100 dark:border-neutral-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={refreshCaptcha}
                                        className="px-3 text-violet-600 border-l-2 border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 h-[55px] flex items-center justify-center transition-colors"
                                        title="Actualiser le captcha"
                                    >
                                        <RotateCw className="w-5 h-5" />
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
                            </div>

                            {/* Bouton de connexion */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="w-full active:scale-[0.98] hover:scale-[1.01] transition-all py-4 rounded-xl bg-violet-600 text-white text-lg font-bold shadow-lg shadow-violet-500/20"
                                >
                                    Se connecter
                                </button>
                
                            </div>
                        </form>
                        <div className="mt-8 flex flex-col items-center gap-4">
                            <div className="flex justify-center items-center">
                                <p className="font-medium text-sm text-gray-500 dark:text-neutral-400">Vous n'avez pas de compte ?</p>
                                <Link to="/register" className="ml-1 font-bold text-sm text-violet-600 hover:underline">S'inscrire</Link>
                            </div>
                            <Link to="/" className="flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Partie décorative de droite */}
            <div className="hidden lg:flex relative h-screen w-1/2 items-center justify-center bg-gray-200 dark:bg-neutral-900 overflow-hidden transition-colors duration-300">
                <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="w-full h-1/2 absolute bottom-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-t border-white/20 dark:border-white/10"></div>
            </div>
        </div>
    );
}
