import { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Info } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

const EXPERT_ITEMS = [
  { id: 1, dimension: 'Comprensión de contenidos (D1)', text: 'Soy capaz de explicar los conceptos aprendidos con mis propias palabras.' },
  { id: 2, dimension: 'Comprensión de contenidos (D1)', text: 'Comprendo la relación entre los temas desarrollados durante la capacitación.' },
  { id: 3, dimension: 'Comprensión de contenidos (D1)', text: 'Puedo aplicar los conocimientos aprendidos en ejercicios prácticos.' },
  { id: 4, dimension: 'Comprensión de contenidos (D1)', text: 'Identifico con claridad las ideas principales del contenido presentado.' },
  { id: 5, dimension: 'Comprensión de contenidos (D1)', text: 'Relaciono los nuevos conocimientos con aprendizajes previos.' },
  { id: 6, dimension: 'Creatividad (D2)', text: 'Genero nuevas ideas a partir de los contenidos aprendidos.' },
  { id: 7, dimension: 'Creatividad (D2)', text: 'Propongo soluciones diferentes utilizando herramientas de IA generativa.' },
  { id: 8, dimension: 'Creatividad (D2)', text: 'Combino diferentes ideas para crear propuestas originales.' },
  { id: 9, dimension: 'Creatividad (D2)', text: 'Exploro nuevas formas de resolver problemas académicos.' },
  { id: 10, dimension: 'Creatividad (D2)', text: 'Adapto los conocimientos aprendidos a nuevas situaciones.' }
];

export function ExpertEvaluationForm({ ratings, onChange, onNext, onBack, currentIndex }) {
  const currentItem = EXPERT_ITEMS[currentIndex];
  const itemRating = ratings[currentItem.id] || { clarity: 5, coherence: 5, relevance: 5, obs: '' };

  const updateRating = (field, value) => {
    onChange(currentItem.id, {
      ...itemRating,
      [field]: value
    });
  };

  const isCurrentAnswered = 
    itemRating.clarity !== undefined && 
    itemRating.coherence !== undefined && 
    itemRating.relevance !== undefined;

  const handleNextClick = () => {
    if (!isCurrentAnswered) {
      alert('Por favor, evalúe todos los criterios del ítem para continuar.');
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Barra de progreso */}
      <ProgressBar
        current={currentIndex + 1}
        total={EXPERT_ITEMS.length}
        phase="EXPERT_EVALUATION"
      />

      {/* Tarjeta del Item */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <span className="px-2.5 py-1 bg-primary/10 text-primary dark:bg-primary/20 text-[10px] font-bold rounded-lg uppercase tracking-wide">
            {currentItem.dimension}
          </span>
          <h3 className="text-lg md:text-xl font-extrabold text-text-main mt-3 select-none leading-relaxed">
            Ítem {currentItem.id}: "{currentItem.text}"
          </h3>
        </div>

        {/* Criterios a calificar */}
        <div className="space-y-6 border-t border-border/40 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Claridad */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-text-main">1. Claridad</label>
                <span className="text-[10px] text-text-muted font-medium">¿Se entiende?</span>
              </div>
              <div className="flex justify-between gap-1.5 bg-surface/50 p-1.5 rounded-xl border border-border/50">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateRating('clarity', val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      itemRating.clarity === val
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-surface text-text-muted hover:text-text-main'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Coherencia */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-text-main">2. Coherencia</label>
                <span className="text-[10px] text-text-muted font-medium">¿Tiene lógica?</span>
              </div>
              <div className="flex justify-between gap-1.5 bg-surface/50 p-1.5 rounded-xl border border-border/50">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateRating('coherence', val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      itemRating.coherence === val
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-surface text-text-muted hover:text-text-main'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Relevancia */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-text-main">3. Relevancia</label>
                <span className="text-[10px] text-text-muted font-medium">¿Es importante?</span>
              </div>
              <div className="flex justify-between gap-1.5 bg-surface/50 p-1.5 rounded-xl border border-border/50">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateRating('relevance', val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      itemRating.relevance === val
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-surface text-text-muted hover:text-text-main'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label htmlFor="obs" className="text-xs font-extrabold text-text-main block">
              Observaciones / Sugerencias (Opcional)
            </label>
            <textarea
              id="obs"
              rows="2"
              placeholder="Escriba aquí alguna sugerencia de redacción o comentarios específicos para este ítem..."
              value={itemRating.obs || ''}
              onChange={(e) => updateRating('obs', e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-border rounded-xl bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Info card contextual */}
        <div className="bg-surface/50 border border-border/40 p-3 rounded-2xl flex items-start gap-2.5 text-[10px] text-text-muted leading-relaxed">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            Las valoraciones de Claridad, Coherencia y Relevancia se miden en una escala del 1 (Insuficiente / Nulo) al 5 (Excelente / Destacado). Estos datos se consolidan para calcular el coeficiente V de Aiken del instrumento.
          </div>
        </div>
      </div>

      {/* Controles de Navegación */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold transition-colors cursor-pointer"
        >
          Atrás
        </button>
        
        <button
          type="button"
          onClick={handleNextClick}
          className="flex items-center gap-1.5 px-7 py-3 font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover hover:shadow cursor-pointer transition-all"
        >
          {currentIndex === EXPERT_ITEMS.length - 1 ? 'Finalizar Evaluación' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
