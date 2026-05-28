import { useState, useEffect } from 'react';
import { Lock, Mail, ArrowLeft, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { checkIsAdmin, hasAdmins, registerFirstAdmin } from '../../lib/surveyService';

export function AdminLogin({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupMode, setSetupMode] = useState(false); // default to false (Login)
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Verificar si la BD ya tiene un administrador al montar
  useEffect(() => {
    async function checkSetup() {
      try {
        const existAdmins = await hasAdmins();
        setSetupMode(!existAdmins);
      } catch (err) {
        console.error('Error checking admin setup (defaulting to Login):', err);
        setSetupMode(false);
      } finally {
        setCheckingSetup(false);
      }
    }
    checkSetup();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      // 1. Autenticar en Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      // 2. Verificar si es admin en la colección 'admins' de Firestore
      const isAdmin = await checkIsAdmin(user.uid);
      if (isAdmin) {
        onLoginSuccess(user);
      } else {
        // Desconectar al usuario no autorizado
        await signOut(auth);
        setError('Acceso denegado: Su cuenta no tiene privilegios de administrador.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo electrónico o contraseña incorrectos.');
      } else {
        setError('Error al iniciar sesión: ' + (err.message || 'Servidor no disponible.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Por favor complete todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const user = await registerFirstAdmin(email.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Error al registrar administrador inicial: ' + (err.message || 'Intente de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <div
        className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm card-shadow relative overflow-hidden transition-all duration-300"
      >
        {/* Decoración de seguridad */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-text-main mb-2">
          {setupMode ? 'Crear Administrador Inicial' : 'Acceso de Administrador'}
        </h2>
        <p className="text-xs text-center text-text-muted mb-6">
          {setupMode 
            ? 'No se detectaron administradores. Registre su cuenta de control para el estudio.' 
            : 'Ingrese sus credenciales autorizadas para visualizar el dashboard estadístico.'
          }
        </p>

        {/* Mensaje de Error */}
        {error && (
          <div
            className="flex items-start gap-2.5 p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold mb-5 border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {setupMode ? (
          /* Formulario de Registro Inicial */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted block">Correo Electrónico Admin</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="admin@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted block">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted block">Confirmar Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Repita la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                loading 
                  ? 'bg-primary/50 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-hover hover:shadow cursor-pointer'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creando cuenta...' : 'Crear Admin e Iniciar'}
            </button>
            
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setSetupMode(false);
                setError('');
              }}
              className="w-full text-center text-xs text-primary hover:underline cursor-pointer font-semibold mt-3"
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </button>
          </form>
        ) : (
          /* Formulario de Login Estándar */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted block">Correo Electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="admin@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted block">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                loading 
                  ? 'bg-primary/50 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-hover hover:shadow cursor-pointer'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </button>
            
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setSetupMode(true);
                setError('');
              }}
              className="w-full text-center text-xs text-primary hover:underline cursor-pointer font-semibold mt-3"
            >
              ¿No hay administradores creados? Registrar Administrador Inicial
            </button>
          </form>
        )}

        {/* Botón para regresar al Cuestionario */}
        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Cuestionario
          </button>
        </div>
      </div>
    </div>
  );
}
