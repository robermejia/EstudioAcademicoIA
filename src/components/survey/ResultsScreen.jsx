import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Download, RefreshCw, AlertCircle, Heart } from 'lucide-react';

export function ResultsScreen({ participantId, syncStatus, errorMsg, onRetrySync, rawData }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(participantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rawData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `respuestas_${participantId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Error al descargar respaldo:', e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border/80 rounded-3xl p-8 md:p-12 shadow-sm card-shadow text-center relative overflow-hidden"
      >
        {/* Decoración superior */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-emerald-500" />
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-3xl">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight leading-tight mb-4">
          ¡Muchas gracias por su participación!
        </h1>

        <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
          Su contribución es fundamental para comprender mejor cómo las herramientas de IA generativa influyen en la efectividad del aprendizaje y el desarrollo creativo. Sus respuestas se han registrado de forma segura.
        </p>

        {/* Tarjeta del ID único */}
        <div className="max-w-md mx-auto bg-surface border border-border/80 rounded-2xl p-5 mb-8">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
            Código Único de Participación
          </span>
          <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
            <code className="text-lg md:text-xl font-bold text-primary font-mono select-all">
              {participantId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-surface hover:bg-surface-hover border-border text-text-muted hover:text-text-main'
              }`}
              title="Copiar código"
            >
              <span className="text-xs font-semibold">{copied ? '¡Copiado!' : <Copy className="w-4 h-4" />}</span>
            </button>
          </div>
          <p className="text-[11px] text-text-muted mt-2">
            Guarde este código si desea hacer alguna consulta posterior sobre sus datos.
          </p>
        </div>

        {/* Estado de Sincronización con Firebase */}
        <div className="max-w-md mx-auto border-t border-border/60 pt-6">
          {syncStatus === 'synced' && (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 rounded-xl py-3 px-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Respuestas sincronizadas en Firebase</span>
            </div>
          )}

          {syncStatus === 'syncing' && (
            <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold bg-primary/10 rounded-xl py-3 px-4 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>Guardando en la base de datos...</span>
            </div>
          )}

          {syncStatus === 'failed' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 text-left text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-xl py-3 px-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Error de conexión con Firebase</span>
                  <span className="text-xs opacity-90 block mt-0.5">
                    No pudimos guardar las respuestas en línea ({errorMsg || 'Error desconocido'}). Su progreso se guardó localmente.
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={onRetrySync}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reintentar Envío
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-surface hover:bg-surface-hover border border-border text-text-main text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Respuestas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>Estudio auspiciado por investigadores académicos.</span>
        </div>
      </motion.div>
    </div>
  );
}
