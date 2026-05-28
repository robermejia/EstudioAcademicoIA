import { ArrowRight, GraduationCap, Award, BookOpen } from 'lucide-react';

export function WelcomeScreen({ onStart }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="w-full bg-card border border-border/80 rounded-3xl p-6 md:p-12 shadow-sm card-shadow text-center">

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl">
            <GraduationCap className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight leading-tight mb-6">
          Cuestionario sobre <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">IA Generativa</span> y Efectividad del Aprendizaje
        </h1>

        <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
          Bienvenido(a) a este cuestionario de investigación académica. El propósito de este estudio es evaluar el impacto del uso de herramientas de Inteligencia Artificial Generativa (como ChatGPT, Gemini y Copilot) en los procesos de comprensión y creatividad de los estudiantes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10 text-left">
          <div className="flex items-start gap-3 p-4 bg-surface rounded-2xl border border-border/50">
            <BookOpen className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-text-main text-sm">Objetivo de Aprendizaje</h4>
              <p className="text-xs text-text-muted mt-1">Medir la comprensión de conceptos y habilidades cognitivas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-surface rounded-2xl border border-border/50">
            <Award className="w-6 h-6 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-text-main text-sm">Dimensión Creativa</h4>
              <p className="text-xs text-text-muted mt-1">Explorar nuevas maneras de abordar retos y resolver problemas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-surface rounded-2xl border border-border/50">
            <GraduationCap className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-text-main text-sm">Fines Académicos</h4>
              <p className="text-xs text-text-muted mt-1">Los resultados serán tratados de forma anónima para fines de investigación.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-base rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Iniciar Cuestionario
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
