import { CheckCircle2, AlertTriangle, RefreshCw, Download, Info } from 'lucide-react';

export function ResultsScreen({ rawData, syncStatus, errorMsg, onRetrySync, participantId }) {
  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rawData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `respuestas_ia_backup_${participantId}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div
        className="bg-card border border-border/80 rounded-3xl p-8 md:p-12 text-center shadow-sm card-shadow relative overflow-hidden transition-all duration-300"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />

        <div className="flex justify-center mb-6">
          {syncStatus === 'synced' ? (
            <div className="p-4 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          ) : syncStatus === 'failed' ? (
            <div className="p-4 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl">
              <AlertTriangle className="w-12 h-12" />
            </div>
          ) : (
            <div className="p-4 bg-primary/10 text-primary dark:bg-primary/20 rounded-2xl animate-spin">
              <RefreshCw className="w-12 h-12" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-extrabold text-text-main tracking-tight mb-4">
          {syncStatus === 'synced' ? '¡Encuesta Completada!' :
           syncStatus === 'failed' ? 'Envío Pendiente' : 'Sincronizando Respuestas'}
        </h2>

        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6">
          {syncStatus === 'synced' ? (
            <span>Sus respuestas han sido almacenadas de manera anónima y segura en la base de datos de la investigación. Agradecemos enormemente su tiempo y colaboración.</span>
          ) : syncStatus === 'failed' ? (
            <span>Hubo un problema de conexión al guardar sus respuestas. No se preocupe, los datos están guardados localmente. Intente retransmitirlos o descargue el archivo de respaldo.</span>
          ) : (
            <span>Estamos subiendo sus resultados al servidor seguro de Firestore. Por favor, mantenga abierta esta pestaña...</span>
          )}
        </p>

        {/* Bloque Informativo de Identificador */}
        <div className="max-w-md mx-auto bg-surface border border-border/50 rounded-2xl p-5 mb-8 text-left">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">ID Único de Participación</span>
          <span className="font-mono text-base font-bold text-primary select-all break-all">{participantId}</span>
          <p className="text-[10px] text-text-muted mt-2">
            Este identificador es anónimo y puede ser utilizado si requiere solicitar la remoción de sus respuestas posteriormente.
          </p>
        </div>

        {/* Controles de Sincronización / Descarga */}
        <div className="space-y-4 max-w-md mx-auto">
          {syncStatus === 'synced' && (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 rounded-xl py-3 px-4">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>Guardado en la nube correctamente</span>
            </div>
          )}

          {syncStatus === 'syncing' && (
            <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold bg-primary/10 rounded-xl py-3 px-4 animate-pulse">
              <RefreshCw className="w-4.5 h-4.5 animate-spin shrink-0" />
              <span>Subiendo datos...</span>
            </div>
          )}

          {syncStatus === 'failed' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs text-left border border-red-500/10">
                <strong>Error de conexión:</strong> {errorMsg || 'No se pudo contactar con Firestore.'}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onRetrySync}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar Envío
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-surface hover:bg-surface-hover border border-border text-text-main font-bold rounded-xl cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar Respaldo
                </button>
              </div>
            </div>
          )}

          {syncStatus === 'synced' && (
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-center gap-1.5 px-5 py-3 bg-surface hover:bg-surface-hover border border-border text-text-main text-xs font-semibold rounded-xl cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar copia local de respuestas (.json)
            </button>
          )}
        </div>

        {syncStatus === 'failed' && (
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-text-muted">
            <Info className="w-4 h-4 text-text-muted shrink-0" />
            <span>Si el error persiste, descargue el archivo de respaldo y envíelo al administrador del estudio.</span>
          </div>
        )}
      </div>
    </div>
  );
}
