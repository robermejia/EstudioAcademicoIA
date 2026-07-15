import { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, AlertTriangle, User, FileText, FlaskConical, Gift, Lock, BookOpen, HandHelping, Mail, Phone } from 'lucide-react';

const Section = ({ icon: iconComponent, title, children, color = 'text-primary', bg = 'bg-primary/10 dark:bg-primary/20' }) => {
  const Icon = iconComponent;
  return (
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
};

export function ConsentForm({ onAccept, onBack, surveyType }) {
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

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
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
            Impacto de la inteligencia artificial generativa en la efectividad del aprendizaje en estudiantes de educación superior virtual en Lima Metropolitana
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs text-text-muted">
            <span><strong className="text-text-main">Investigadores:</strong> Roberto Agustín Mejía Collazos &amp; Miguel Ángel Velásquez Ysuiza</span>
            <span className="hidden sm:inline text-border">|</span>
            <span><strong className="text-text-main">Institución:</strong> UTP</span>
          </div>
        </div>

        {/* Cuerpo del consentimiento */}
        <div className="px-6 py-6 space-y-6 divide-y divide-border/50">

          {/* 1. Propósito del estudio */}
          <Section icon={FileText} title="Propósito del estudio">
            {surveyType === 'contenido' ? (
              <>
                <p>
                  Este cuestionario forma parte de un estudio que analiza el impacto del uso de herramientas de inteligencia artificial generativa en el aprendizaje de estudiantes de educación superior virtual. Se busca comprender cómo estas herramientas influyen en la manera en que los estudiantes procesan la información y desarrollan sus capacidades de aprendizaje.
                </p>
                <p>
                  <strong className="text-text-main">Objetivo del cuestionario:</strong> El objetivo es evaluar la efectividad del aprendizaje desde la percepción del estudiante. Para ello, se analizarán aspectos relacionados con la comprensión de los contenidos y la capacidad de aplicar el conocimiento de manera creativa.
                </p>
              </>
            ) : (
              <>
                <p>
                  He sido invitado(a) a participar del estudio titulado{' '}
                  <em>"Impacto de la inteligencia artificial generativa en la efectividad del aprendizaje en estudiantes de educación superior virtual en Lima Metropolitana"</em>,
                  realizado por <strong className="text-text-main">Roberto Agustín Mejía Collazos</strong> y{' '}
                  <strong className="text-text-main">Miguel Ángel Velásquez Ysuiza</strong>, de la Universidad Tecnológica del Perú (UTP).
                </p>
                <p>
                  El objetivo es recopilar información sobre el uso de herramientas de inteligencia artificial generativa (ChatGPT, Gemini y Copilot)
                  y su influencia en la efectividad del aprendizaje en jóvenes universitarios entre 18 y 38 años
                  pertenecientes a comunidades académicas virtuales.
                </p>
                <p className="mt-2">
                  Se entiende por inteligencia artificial generativa a las herramientas digitales capaces de generar respuestas, textos o contenidos para apoyar el aprendizaje, como ChatGPT, Gemini y Copilot. Asimismo, la efectividad del aprendizaje se refiere a la capacidad del estudiante para comprender los contenidos, retener los conocimientos adquiridos y aplicarlos en situaciones académicas.
                </p>
              </>
            )}
          </Section>

          {/* 2. Procedimientos */}
          <div className="pt-5">
            <Section icon={BookOpen} title="Procedimientos" color="text-sky-600 dark:text-sky-400" bg="bg-sky-500/10 dark:bg-sky-500/20">
              {surveyType === 'contenido' ? (
                <>
                  <p>La participación se realizará de manera <strong className="text-text-main">virtual</strong> mediante esta plataforma web. Su rol consiste en realizar la evaluación de expertos del instrumento de efectividad de aprendizaje:</p>
                  <p className="font-semibold text-text-main">
                    Evalúa cada ítem asignando un puntaje del 1 al 5 en los siguientes criterios:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-text-muted">
                    <li><strong>Claridad:</strong> ¿El ítem se redactó de manera entendible?</li>
                    <li><strong>Coherencia:</strong> ¿El ítem tiene lógica interna con el tema?</li>
                    <li><strong>Relevancia:</strong> ¿El ítem es importante para medir la variable?</li>
                  </ul>
                  <p className="mt-2">Finalmente, puedes agregar observaciones si lo consideras necesario.</p>
                  <p className="font-semibold text-text-main mt-3">Escala de Calificación:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-text-muted">
                    <li><strong>1</strong> = Insuficiente</li>
                    <li><strong>2</strong> = En inicio</li>
                    <li><strong>3</strong> = En desarrollo</li>
                    <li><strong>4</strong> = Logrado</li>
                    <li><strong>5</strong> = Destacado</li>
                  </ul>
                  <p className="font-semibold text-primary mt-3">
                    Responde con sinceridad. (Se calculará la validez de contenido por el coeficiente V de Aiken).
                  </p>
                </>
              ) : (
                <>
                  <p>La participación se realizará de manera <strong className="text-text-main">virtual</strong> mediante esta plataforma web. El procedimiento comprende el siguiente orden cronológico:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-text-muted">
                    <li>Leeré el consentimiento informado.</li>
                    <li>Aceptaré participar voluntariamente.</li>
                    <li>Completaré la ficha de datos generales (edad, sexo, experiencia previa con IA y herramienta de IA utilizada con mayor frecuencia).</li>
                    <li>Responderé el cuestionario inicial (Pretest), el cual consta de 19 ítems.</li>
                    <li>Visualizaré un video de capacitación sobre inteligencia artificial generativa.</li>
                    <li>Responderé el cuestionario final (Postest), el cual consta de los mismos 19 ítems.</li>
                  </ol>
                  <p className="mt-3">
                    <strong className="text-text-main">Información adicional sobre el procedimiento:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-text-muted">
                    <li>Todo el proceso se realizará virtualmente a través de esta plataforma web, desde un espacio elegido por el participante que le permita desarrollar las actividades con comodidad y privacidad.</li>
                    <li>La duración aproximada de la participación es de entre 15 y 20 minutos.</li>
                    <li>El instrumento utilizado será el <em>"Cuestionario sobre Inteligencia Artificial Generativa y Efectividad del Aprendizaje"</em>, conformado por 19 ítems que serán aplicados tanto en el pretest como en el postest, valorados en escala de Likert de 5 puntos.</li>
                    <li>Las dimensiones evaluadas corresponden al uso de herramientas de Inteligencia Artificial Generativa (dimensiones: ChatGPT, Gemini y Copilot) y la efectividad del aprendizaje (dimensiones: Comprensión de contenidos y Creatividad).</li>
                  </ul>
                </>
              )}
            </Section>
          </div>

          {/* 3. Riesgos */}
          <div className="pt-5">
            <Section icon={AlertTriangle} title="Riesgos" color="text-amber-500 dark:text-amber-500/20" bg="bg-amber-500/10 dark:bg-amber-500/20">
              <p>
                He sido informado(a) de que <strong className="text-text-main">no existe riesgo</strong> por participar en este estudio.
                La participación no representa riesgos físicos, psicológicos, sociales ni económicos. Se considera una actividad de <strong className="text-text-main">riesgo mínimo</strong>.
              </p>
            </Section>
          </div>

          {/* 4. Beneficios */}
          <div className="pt-5">
            <Section icon={Gift} title="Beneficios" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-500/10 dark:bg-emerald-500/20">
              <p>
                No existen beneficios directos para el participante. Los beneficios obtenidos serán únicamente indirectos para futuras investigaciones y para mejorar el conocimiento científico.
              </p>
            </Section>
          </div>

          {/* 5. Costos e incentivos */}
          <div className="pt-5">
            <Section icon={HandHelping} title="Costos e incentivos" color="text-violet-600 dark:text-violet-400" bg="bg-violet-500/10 dark:bg-violet-500/20">
              <p>
                No debo pagar nada por participar en este estudio. La participación es completamente voluntaria y{' '}
                <strong className="text-text-main">no contempla incentivos económicos, materiales ni académicos</strong>.
              </p>
            </Section>
          </div>

          {/* 6. Confidencialidad */}
          <div className="pt-5">
            <Section icon={Lock} title="Confidencialidad" color="text-primary" bg="bg-primary/10 dark:bg-primary/20">
              <p>
                Los investigadores utilizarán todas las herramientas posibles para proteger la confidencialidad y el anonimato del participante.
                La información que brinde solo será conocida por los investigadores arriba señalados y únicamente se utilizará con fines de investigación.
              </p>
              <p className="mt-2">
                Los resultados serán analizados de forma <strong className="text-text-main">agrupada</strong>, garantizando el anonimato
                de los participantes y evitando cualquier identificación individual.
              </p>
            </Section>
          </div>

          {/* 7. Presentación del informe */}
          <div className="pt-5">
            <Section icon={FlaskConical} title="Presentación del informe" color="text-sky-600 dark:text-sky-400" bg="bg-sky-500/10 dark:bg-sky-500/20">
              <p>
                Los resultados serán presentados a la Universidad Tecnológica del Perú como parte del informe de investigación. La información obtenida podrá formar parte de tesis, informes académicos y publicaciones científicas. Cuando corresponda, el informe podrá estar disponible en el repositorio institucional de la universidad o en revistas científicas.
              </p>
            </Section>
          </div>

          {/* 8. Derechos del participante */}
          <div className="pt-5">
            <Section icon={User} title="Derechos del participante" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-500/10 dark:bg-emerald-500/20">
              <div className="space-y-3">
                <p>
                  La participación es completamente voluntaria. El participante puede retirarse del estudio en cualquier momento sin que eso tenga ninguna consecuencia negativa para él o su familia.
                </p>
                <p>
                  Si tiene dudas sobre la investigación, puede comunicarse con los investigadores mediante el teléfono o correo institucional detallados abajo.
                </p>
                <p>
                  Si considera que fue tratado injustamente, puede comunicarse con el <strong>Comité de Ética en Investigación de la Universidad Tecnológica del Perú</strong> mediante el correo electrónico <a href="mailto:comiteetica@utp.edu.pe" className="text-primary underline">comiteetica@utp.edu.pe</a>. El Comité de Ética en Investigación tiene como finalidad proteger la integridad y los derechos de todos los participantes de estudios académicos.
                </p>
              </div>

              {/* Tarjeta de Contacto Integrada */}
              <div className="mt-4 bg-surface border border-border/60 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-text-main uppercase tracking-wide mb-2">Datos de contacto de los investigadores</p>
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
                      <p>965 367 734</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>

        </div>

        {/* 9. CONSENTIMIENTO */}
        <div className="px-6 pb-6 border-t border-border/50 pt-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">CONSENTIMIENTO</h3>
            </div>

            <div className="pl-8 space-y-4">
              <p className="text-sm text-text-muted leading-relaxed">
                Comprendo la información expuesta anteriormente y acepto participar voluntariamente en esta investigación, sabiendo que puedo retirar mi consentimiento e interrumpir mi participación en cualquier momento, sin consecuencias negativas para mí ni para mi familia.
              </p>

              {/* Formulario con Casillas de Aceptación */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Casilla 1: Mayoría de edad */}
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
                    Confirmo que soy <strong>mayor de 18 años</strong>.
                  </span>
                </label>

                {/* Casilla 2: Aceptación de participación */}
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
                    He leído y acepto el presente consentimiento informado y <strong>acepto participar voluntariamente</strong> en esta investigación.
                  </span>
                </label>

                {showError && (
                  <p className="text-xs text-red-500 font-medium bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-xl px-3 py-2">
                    Por favor, confirme ambas casillas de aceptación para continuar.
                  </p>
                )}

                <p className="text-[10px] text-text-muted italic pt-1">
                  Una copia de este consentimiento informado puede ser solicitada a los investigadores.
                </p>

                {/* Botones de navegación */}
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
                    disabled={!(acceptedTerms && isAdult)}
                    className={`flex items-center gap-1.5 px-6 py-3 font-semibold rounded-xl text-white shadow-sm transition-all ${
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
    </div>
  );
}
