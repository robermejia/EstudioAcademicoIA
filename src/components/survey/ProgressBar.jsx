export function ProgressBar({ current, total, phase }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
            phase === 'PRETEST' || phase === 'Pretest'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
              : phase === 'EXPERT_EVALUATION'
              ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}>
            Fase: {
              phase === 'PRETEST' || phase === 'Pretest' 
                ? 'Pretest' 
                : phase === 'EXPERT_EVALUATION'
                ? 'Evaluación de Experto'
                : 'Posttest'
            }
          </span>
          <span className="text-sm font-semibold text-text-muted">
            Pregunta {current} de {total}
          </span>
        </div>
        <span className="text-sm font-bold text-primary">
          {Math.round(percentage)}% completado
        </span>
      </div>

      <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            phase === 'PRETEST' || phase === 'Pretest' 
              ? 'bg-primary' 
              : phase === 'EXPERT_EVALUATION'
              ? 'bg-violet-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
