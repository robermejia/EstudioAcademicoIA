import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Video, ArrowRight, AlertCircle, Info } from 'lucide-react';

export function VideoTraining({ onComplete, onBack }) {
  // Video id: IA Generativa y Efectividad del Aprendizaje
  const videoId = 'uerAe6FFyXs';
  const playerRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState('unstarted'); // unstarted, playing, paused, ended
  const [progress, setProgress] = useState(0); // porcentaje visto
  const [canProceed, setCanProceed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  function onPlayerReady(event) {
    setDuration(event.target.getDuration());
  }

  function onPlayerStateChange(event) {
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    const state = event.data;
    if (state === 1) {
      setVideoStatus('playing');
    } else if (state === 2) {
      setVideoStatus('paused');
    } else if (state === 0) {
      setVideoStatus('ended');
      setCanProceed(true);
      setProgress(100);
    }
  }

  useEffect(() => {
    // 1. Cargar el script de YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Callback global de YouTube
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          hl: 'es',
          cc_lang_pref: 'es'
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Intervalo para verificar el progreso de reproducción
    let progressInterval;
    if (videoStatus === 'playing') {
      progressInterval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const current = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration() || 1;
          setCurrentTime(current);
          setDuration(dur);
          
          const pct = (current / dur) * 100;
          setProgress(Math.round(pct));
          
          // Si ha visto más del 90%, habilitar el botón
          if (pct >= 90) {
            setCanProceed(true);
          }
        }
      }, 1000);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [videoStatus]);

  // Función para simular ver el video (útil para pruebas)
  const simulateCompletion = () => {
    setCanProceed(true);
    setProgress(100);
    setVideoStatus('ended');
  };

  const formatTime = (timeInSeconds) => {
    const min = Math.floor(timeInSeconds / 60);
    const sec = Math.floor(timeInSeconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm card-shadow text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-text-main text-left">
            Capacitación sobre IA Generativa
          </h2>
        </div>

        <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto mb-6">
          Antes de continuar con la fase de <strong>Posttest</strong>, visualice el siguiente video educativo sobre los fundamentos de ChatGPT, Gemini y Copilot, y cómo influyen en el aprendizaje.
        </p>

        {/* Contenedor del video responsivo */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/80 bg-black shadow-inner mb-4">
          <div id="youtube-player" className="absolute inset-0 w-full h-full" />
        </div>

        {/* Nota sobre la pista de audio en español */}
        <div className="max-w-2xl mx-auto flex items-start gap-2.5 text-xs text-text-muted bg-surface/50 border border-border/40 rounded-xl p-3 mb-6 text-left">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5 animate-pulse" />
          <p>
            <strong>Pista de audio en Español:</strong> Si el video no se escucha en español de forma automática, haz clic en la rueda de configuración del reproductor (⚙️), selecciona <strong>Pista de audio</strong> y marca <strong>Español (doblado)</strong>.
          </p>
        </div>

        {/* Métricas de Progreso del Video */}
        <div className="max-w-xl mx-auto bg-surface border border-border/50 rounded-2xl p-4 mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-text-muted mb-2">
            <span>Progreso del Video: {progress}%</span>
            <span>Requisito: Mínimo 90%</span>
          </div>
          <div className="w-full h-2 bg-card rounded-full overflow-hidden border border-border/40 mb-3">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                canProceed ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Play className="w-3.5 h-3.5 text-primary" />
              <span>Estado: {
                videoStatus === 'playing' ? 'Reproduciendo' :
                videoStatus === 'paused' ? 'Pausado' :
                videoStatus === 'ended' ? 'Finalizado' : 'Sin iniciar'
              }</span>
            </div>
            {duration > 0 && (
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>
        </div>

        {/* Alertas explicativas */}
        {!canProceed && (
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium mb-6 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Por favor, reproduzca el video para habilitar la segunda fase del estudio.</span>
          </div>
        )}

        {canProceed && (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-6">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>¡Excelente! Ya puede pasar al Posttest.</span>
          </div>
        )}

        {/* Controles de Navegación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold transition-colors cursor-pointer"
          >
            Atrás (Pretest)
          </button>
          
          <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={!canProceed}
              onClick={onComplete}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-3.5 font-bold rounded-xl text-white transition-all shadow-md ${
                canProceed
                  ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg cursor-pointer'
                  : 'bg-text-muted/30 cursor-not-allowed opacity-50'
              }`}
            >
              Comenzar Posttest
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Bypass discreto para desarrollo y pruebas */}
            <button 
              type="button"
              onClick={simulateCompletion}
              className="text-[10px] text-text-muted hover:text-primary underline cursor-pointer mt-1"
            >
              [Simular visualización para pruebas rápidas]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
