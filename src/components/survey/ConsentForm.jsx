import { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, AlertTriangle, User, FileText, FlaskConical, Gift, Lock, BookOpen, HandHelping, Mail, Phone } from 'lucide-react';

export function ConsentForm({ onAccept, onBack }) {
  const [isAdult, setIsAdult] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptedTerms && isAdult) {
      onAccept();
    } else {
      setShowError(true);
    }
  };

  const Section = ({ icon: Icon, title, children, color = 'text-primary', bg = 'bg-primary/10 dark:bg-primary/20' }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 ${bg} ${color} rounded-lg shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="pl-8 text-sm text-text-muted leading-relaxed space-y-1.5">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm card-shadow overflow-hidden">

        {/* Cabecera institucional */}
        <div className="bg-primary px-6 pt-7 pb-6 text-white">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/15 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Universidad Tecnológica del Perú</p>
              <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
                Consentimiento Informado para Participar en la Investigación
              </h2>
            </div>
          </div>
        </div>

        {/* Título y datos del estudio */}
        <div className="px-6 py-5 bg-primary/5 border-b border-border/60">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Título de la investigación</p>
          <p className="text-sm font-bold text-text-main leading-snug">
            Impacto de la inteligencia artificial generativa en la efectividad del aprendizaje en estudiantes de educación superior virtual
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs text-text-muted">
            <span><strong className="text-text-main">Investigadores:</strong> Roberto Agustín Mejía Collazos &amp; Miguel Ángel Velásquez Ysuiza</span>
            <span className="hidden sm:inline text-border">|</span>
            <span><strong className="text-text-main">Institución:</strong> UTP</span>
          </div>
        </div>

        {/* Cuerpo del consentimiento */}
        <div className="px-6 py-6 space-y-6 divide-y divide-border/50">

          {/* Propósito / Objetivo */}
          <Section icon={FileText} title="Propósito del estudio">
            <p>
              He sido invitado(a) a participar del estudio titulado{' '}
              <em>"Impacto de la inteligencia artificial generativa en la efectividad del aprendizaje en estudiantes de educación superior virtual"</em>,
              realizado por <strong className="text-text-main">Roberto Agustín Mejía Collazos</strong> y{' '}
              <strong className="text-text-main">Miguel Ángel Velásquez Ysuiza</strong>, de la Universidad Tecnológica del Perú (UTP).
            </p>
            <p>
              El objetivo es recopilar información sobre el uso de herramientas de inteligencia artificial generativa (ChatGPT, Gemini y Copilot)
              y su influencia en la efectividad del aprendizaje en jóvenes universitarios entre 18 y 35 años
              pertenecientes a comunidades académicas virtuales.
            </p>
          </Section>

          {/* Procedimiento */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Procedimiento de participación</h3>
            </div>
            <div className="pl-8 text-sm text-text-muted leading-relaxed space-y-1.5">
              <p>La participación se realizará de manera <strong className="text-text-main">virtual</strong> mediante esta plataforma web. El procedimiento comprende:</p>
              <ol className="list-decimal pl-5 space-y-1 text-text-muted">
                <li>Lectura y aceptación del presente consentimiento informado.</li>
                <li>Confirmación de mayoría de edad.</li>
                <li>Desarrollo del cuestionario inicial (<strong className="text-text-main">pretest</strong>).</li>
                <li>Visualización de un <strong className="text-text-main">video de capacitación</strong> sobre inteligencia artificial generativa.</li>
                <li>Desarrollo del cuestionario final (<strong className="text-text-main">postest</strong>).</li>
              </ol>
              <p className="mt-2">
                <strong className="text-text-main">Tiempo estimado:</strong> entre 15 y 20 minutos.{' '}
                <strong className="text-text-main">Total de preguntas:</strong> 20 ítems en escala Likert, más preguntas de caracterización general.
              </p>
              <div className="mt-2 space-y-1">
                <p><strong className="text-text-main">Datos que se recogerán:</strong></p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Edad y sexo.</li>
                  <li>Uso de herramientas de IA generativa (ChatGPT, Gemini, Copilot).</li>
                  <li>Nivel de comprensión de contenidos y creatividad en el aprendizaje.</li>
                  <li>Respuestas al pretest y postest.</li>
                </ul>
                <p className="text-xs italic mt-1">No se solicitarán datos sensibles ni información que permita identificar personalmente a los participantes.</p>
              </div>
            </div>
          </div>

          {/* Riesgos */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Riesgos</h3>
            </div>
            <p className="pl-8 text-sm text-text-muted">
              He sido informado(a) de que <strong className="text-text-main">no existe riesgo</strong> por participar en este estudio.
              La participación no representa riesgos físicos, psicológicos, sociales ni económicos. Se considera una actividad de <strong className="text-text-main">riesgo mínimo</strong>.
            </p>
          </div>

          {/* Beneficios */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Beneficios</h3>
            </div>
            <div className="pl-8 text-sm text-text-muted space-y-1">
              <p>Sé que los resultados de este estudio servirán para:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Conocer herramientas de inteligencia artificial generativa.</li>
                <li>Fortalecer competencias relacionadas con el aprendizaje digital.</li>
                <li>Contribuir al desarrollo de conocimiento académico sobre el uso de la IA en entornos educativos.</li>
              </ul>
            </div>
          </div>

          {/* Costos e incentivos */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded-lg shrink-0">
                <HandHelping className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Costos e incentivos</h3>
            </div>
            <p className="pl-8 text-sm text-text-muted">
              No debo pagar nada por participar en este estudio. La participación es completamente voluntaria y{' '}
              <strong className="text-text-main">no contempla incentivos económicos, materiales ni académicos</strong>.
            </p>
          </div>

          {/* Confidencialidad */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Confidencialidad y anonimato</h3>
            </div>
            <div className="pl-8 text-sm text-text-muted space-y-1">
              <p>
                Los investigadores utilizarán todas las herramientas posibles para proteger la confidencialidad y el anonimato del participante.
                La información que brinde solo será conocida por los investigadores arriba señalados y únicamente se utilizará con fines de investigación.
              </p>
              <p>
                Los resultados serán analizados de forma <strong className="text-text-main">agrupada</strong>, garantizando el anonimato
                de los participantes y evitando cualquier identificación individual.
              </p>
            </div>
          </div>

          {/* Presentación de resultados */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                <FlaskConical className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Uso y presentación de los resultados</h3>
            </div>
            <p className="pl-8 text-sm text-text-muted">
              Sé que el informe con los resultados del estudio se presentará a la <strong className="text-text-main">Universidad Tecnológica del Perú (UTP)</strong>.
              La información obtenida será utilizada únicamente para fines académicos, pudiendo formar parte de informes,
              trabajos de investigación, artículos científicos o tesis relacionados con el estudio.
            </p>
          </div>

          {/* Derechos */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">Derechos del participante</h3>
            </div>
            <div className="pl-8 text-sm text-text-muted space-y-1.5">
              <p>
                Mi participación en este estudio es <strong className="text-text-main">voluntaria</strong>.
                Si durante el recojo de información decido interrumpir o no continuar con el proceso, puedo retirarme del estudio
                sin que eso tenga ninguna consecuencia negativa para mí o para mi familia.
              </p>
              <p>
                Si tengo alguna duda, puedo contactar a los investigadores (ver datos al pie).
                En caso crea haber sido tratado(a) injustamente, puedo comunicarme con el{' '}
                <strong className="text-text-main">Comité de Ética en Investigación de la UTP</strong> al correo:{' '}
                <a href="mailto:comiteetica@utp.edu.pe" className="text-primary underline">comiteetica@utp.edu.pe</a>
              </p>
            </div>
          </div>

          {/* Datos de contacto */}
          <div className="pt-5">
            <div className="bg-surface border border-border/60 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-text-main uppercase tracking-wide mb-2">Datos de contacto</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-muted">
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-main">Correo electrónico</p>
                    <a href="mailto:U23254461@utp.edu.pe" className="text-primary hover:underline block">U23254461@utp.edu.pe</a>
                    <a href="mailto:U23231519@utp.edu.pe" className="text-primary hover:underline block">U23231519@utp.edu.pe</a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-main">Teléfono de contacto</p>
                    <p>991 585 471</p>
                    <p>065 367 734</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Declaración de consentimiento */}
        <div className="px-6 pb-6">
          <div className="border-t border-border/60 pt-5">
            <p className="text-sm font-bold text-text-main mb-4">Declaración de consentimiento</p>
            <p className="text-xs text-text-muted mb-4">
              He leído y comprendido la información expuesta arriba. Comprendo que mi participación es voluntaria
              y que puedo interrumpirla en cualquier momento sin consecuencias negativas.
            </p>

            {/* Checkboxes */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="confirm-adult"
                  type="checkbox"
                  checked={isAdult}
                  onChange={(e) => {
                    setIsAdult(e.target.checked);
                    setShowError(false);
                  }}
                  className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                />
                <span className="text-sm font-medium text-text-main leading-snug">
                  ☐ Confirmo que soy <strong>mayor de 18 años</strong>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="confirm-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    setShowError(false);
                  }}
                  className="mt-0.5 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                />
                <span className="text-sm font-medium text-text-main leading-snug">
                  ☐ He leído y acepto el presente consentimiento informado y <strong>acepto participar voluntariamente</strong> en esta investigación.
                </span>
              </label>

              {showError && (
                <p className="text-xs text-red-500 font-medium bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-xl px-3 py-2">
                  Por favor, confirme ambas casillas para continuar.
                </p>
              )}

              <p className="text-[10px] text-text-muted italic pt-1">
                Una copia de este consentimiento informado puede ser solicitada a los investigadores.
              </p>

              {/* Botones */}
              <div className="flex justify-between items-center pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-6 py-3 font-semibold rounded-xl text-white shadow-sm ${
                    acceptedTerms && isAdult
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
        </div>

      </div>
    </div>
  );
}
