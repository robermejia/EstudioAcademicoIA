import { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export function ConsentForm({ onAccept, onBack }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(null); // null | 'yes' | 'no'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptedTerms && isAdult === 'yes') {
      onAccept();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {isAdult === 'no' ? (
        <div
          className="bg-card border border-red-200 dark:border-red-950/30 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden transition-all duration-300"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-red-500" />
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl animate-pulse">
              <AlertTriangle className="w-12 h-12" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4">
            Participación Restringida
          </h2>

          <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">
            Lo sentimos, pero de acuerdo con las normativas éticas de investigación académica y protección de datos, este estudio está dirigido exclusivamente a personas mayores de edad (18 años o más). Agradecemos sinceramente su interés en participar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAdult(null);
                setAcceptedTerms(false);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-surface hover:bg-surface-hover text-text-main font-semibold rounded-xl border border-border transition-colors cursor-pointer"
            >
              Cambiar Respuesta
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      ) : (
        <div
          className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm card-shadow transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-text-main">
              Consentimiento Informado
            </h2>
          </div>

          <div className="space-y-4 text-text-muted leading-relaxed text-sm md:text-base border-b border-border/60 pb-6 mb-6 max-h-[350px] overflow-y-auto pr-2">
            <p>
              Por favor, lea atentamente la siguiente información antes de decidir participar en este estudio académico:
            </p>
            <ul className="list-disc pl-5 space-y-2.5">
              <li>
                <strong className="text-text-main">Participación Voluntaria:</strong> Su participación en este cuestionario es completamente voluntaria. Puede decidir no contestar o retirarse en cualquier momento sin penalización alguna.
              </li>
              <li>
                <strong className="text-text-main">Confidencialidad de Datos:</strong> Toda la información recopilada será estrictamente confidencial. Las respuestas serán agrupadas para el análisis estadístico y en ningún caso se asociarán con su identidad.
              </li>
              <li>
                <strong className="text-text-main">Uso Académico:</strong> Los datos obtenidos serán utilizados únicamente para fines de investigación académica, publicaciones científicas o presentaciones en conferencias educativas.
              </li>
              <li>
                <strong className="text-text-main">Anonimato:</strong> No se recopilan nombres, direcciones de correo electrónico ni datos de identificación personal directa. Se le asignará un ID de participación aleatorio al finalizar.
              </li>
            </ul>
            <p className="text-xs text-text-muted mt-4 italic">
              Al aceptar este documento, usted declara que comprende las condiciones descritas y autoriza el uso académico de sus respuestas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pregunta Mayor de Edad */}
            <div className="bg-surface border border-border/50 rounded-2xl p-5">
              <label className="flex items-center gap-2 text-sm font-bold text-text-main mb-3">
                <UserCheck className="w-4 h-4 text-primary" />
                ¿Es usted mayor de edad? (18 años o más) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdult('yes')}
                  className={`w-full py-3.5 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                    isAdult === 'yes'
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-card border-border hover:border-text-muted text-text-main'
                  }`}
                >
                  Sí, soy mayor de edad
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdult('no')}
                  className={`w-full py-3.5 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                    isAdult === 'no'
                      ? 'bg-red-500 border-red-500 text-white shadow-sm'
                      : 'bg-card border-border hover:border-text-muted text-text-main'
                  }`}
                >
                  No, soy menor de edad
                </button>
              </div>
            </div>

            {/* Checkbox de consentimiento */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer"
              />
              <span className="text-sm font-medium text-text-muted leading-tight">
                He leído el consentimiento informado y acepto participar voluntariamente en este estudio bajo los términos de confidencialidad y anonimato. *
              </span>
            </label>

            {/* Botones de Navegación */}
            <div className="flex justify-between items-center pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              
              <button
                type="submit"
                disabled={!acceptedTerms || isAdult !== 'yes'}
                className={`flex items-center gap-1.5 px-6 py-3 font-semibold rounded-xl text-white transition-all shadow-sm ${
                  acceptedTerms && isAdult === 'yes'
                    ? 'bg-primary hover:bg-primary-hover hover:shadow cursor-pointer'
                    : 'bg-text-muted/30 cursor-not-allowed opacity-60'
                }`}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
