import { useState } from 'react';
import { ArrowRight, GraduationCap, Award, Users, BookOpen, Check } from 'lucide-react';

export function WelcomeScreen({ onStart, showSelector = false }) {
  const [selectedType, setSelectedType] = useState('criterio'); // 'criterio' o 'contenido'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="w-full bg-card border border-border/80 rounded-3xl p-6 md:p-12 shadow-sm card-shadow text-center space-y-8">

        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl">
            <GraduationCap className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight leading-tight">
            Cuestionario sobre <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">IA Generativa</span> y Efectividad del Aprendizaje
          </h1>

          <p className="text-sm md:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Bienvenido(a) a este cuestionario de investigación académica. El propósito de este estudio es evaluar el impacto del uso de herramientas de Inteligencia Artificial Generativa en los procesos de comprensión y creatividad de los estudiantes.
          </p>
        </div>

        {/* Selector de Perfil/Encuesta */}
        {showSelector && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest block">
              Selecciona tu perfil de acceso
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Opción 1: Validez de Contenido */}
              <div
                onClick={() => setSelectedType('contenido')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative ${
                  selectedType === 'contenido'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                    : 'border-border/60 hover:border-border bg-surface/50'
                }`}
              >
                {selectedType === 'contenido' && (
                  <div className="absolute top-3 right-3 bg-primary text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${selectedType === 'contenido' ? 'bg-primary/20 text-primary' : 'bg-surface border border-border text-text-muted'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-text-main">Validez de contenido</h3>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  <strong>(Evaluación de expertos)</strong> → Diseñado para evaluadores del instrumento académico. Se calcula Aiken’s V.
                </p>
              </div>

              {/* Opción 2: Validez de Criterio */}
              <div
                onClick={() => setSelectedType('criterio')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative ${
                  selectedType === 'criterio'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                    : 'border-border/60 hover:border-border bg-surface/50'
                }`}
              >
                {selectedType === 'criterio' && (
                  <div className="absolute top-3 right-3 bg-primary text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${selectedType === 'criterio' ? 'bg-primary/20 text-primary' : 'bg-surface border border-border text-text-muted'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-text-main">Validez de criterio</h3>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  <strong>(Grupo piloto de 20-30 personas)</strong> → Diseñado para estudiantes. Los participantes responden: escala Likert, pretest y postest.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => onStart(selectedType)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold text-base rounded-2xl shadow-md hover:shadow-lg cursor-pointer"
        >
          Iniciar Evaluación
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
