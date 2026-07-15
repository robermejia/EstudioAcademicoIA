import { useState } from 'react';
import { ArrowRight, ArrowLeft, Award, Users, Check } from 'lucide-react';

export function SelectTypeScreen({ onSelect, onBack }) {
  const [selectedType, setSelectedType] = useState('criterio'); // 'criterio' o 'contenido'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
      <div className="w-full bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm card-shadow space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-text-main">
            Selecciona tu perfil de acceso
          </h2>
          <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
            Por favor, indica tu rol en esta investigación para continuar con la sección correspondiente.
          </p>
        </div>

        {/* Selector de Perfil/Encuesta */}
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
              <strong>(Evaluación de expertos)</strong> → Diseñado para evaluadores del instrumento académico. Se calcula V de Aiken.
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
              <strong>(Grupo piloto de 20-30 personas)</strong> → Diseñado para estudiantes. Los participantes responden pretest y postest.
            </p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center pt-6 border-t border-border/60">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
          
          <button
            onClick={() => onSelect(selectedType)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-md cursor-pointer"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
