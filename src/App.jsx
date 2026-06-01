import { useState, useEffect } from 'react';
import { Sun, Moon, RotateCcw, GraduationCap } from 'lucide-react';

// Cargar Componentes del Cuestionario
import { WelcomeScreen } from './components/survey/WelcomeScreen';
import { ConsentForm } from './components/survey/ConsentForm';
import { DemographicsForm } from './components/survey/DemographicsForm';
import { LikertCard } from './components/survey/LikertCard';
import { ProgressBar } from './components/survey/ProgressBar';
import { VideoTraining } from './components/survey/VideoTraining';
import { ResultsScreen } from './components/survey/ResultsScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Cargar Servicios y Utilidades
import {
  generateParticipantId,
  saveLocalProgress,
  getLocalProgress,
  clearLocalProgress,
  submitSurveyResponse
} from './lib/surveyService';

// Definición de las 19 preguntas del Cuestionario
const QUESTIONS = [
  // Dimensión: ChatGPT
  { id: 'chatgpt_q1', dimension: 'ChatGPT', text: 'ChatGPT me ayuda a comprender mejor los temas académicos.' },
  { id: 'chatgpt_q2', dimension: 'ChatGPT', text: 'Utilizo ChatGPT para resolver dudas relacionadas con mis estudios.' },
  { id: 'chatgpt_q3', dimension: 'ChatGPT', text: 'ChatGPT facilita mi aprendizaje de nuevos contenidos.' },

  // Dimensión: Gemini
  { id: 'gemini_q1', dimension: 'Gemini', text: 'Gemini facilita la búsqueda de información académica.' },
  { id: 'gemini_q2', dimension: 'Gemini', text: 'Gemini me ayuda a organizar mejor mis ideas y contenidos.' },
  { id: 'gemini_q3', dimension: 'Gemini', text: 'Considero que Gemini mejora mi aprendizaje autónomo.' },

  // Dimensión: Copilot
  { id: 'copilot_q1', dimension: 'Copilot', text: 'Copilot me ayuda a generar soluciones o ideas nuevas.' },
  { id: 'copilot_q2', dimension: 'Copilot', text: 'Copilot facilita el desarrollo de actividades académicas.' },
  { id: 'copilot_q3', dimension: 'Copilot', text: 'Considero que Copilot mejora mi productividad académica.' },

  // Dimensión: Comprensión de contenidos
  { id: 'comprension_q1', dimension: 'Comprensión de contenidos', text: 'Soy capaz de explicar los conceptos aprendidos con mis propias palabras.' },
  { id: 'comprension_q2', dimension: 'Comprensión de contenidos', text: 'Comprendo la relación entre los temas desarrollados durante la capacitación.' },
  { id: 'comprension_q3', dimension: 'Comprensión de contenidos', text: 'Puedo aplicar los conocimientos aprendidos en ejercicios prácticos.' },
  { id: 'comprension_q4', dimension: 'Comprensión de contenidos', text: 'Identifico con claridad las ideas principales del contenido presentado.' },
  { id: 'comprension_q5', dimension: 'Comprensión de contenidos', text: 'Relaciono los nuevos conocimientos con aprendizajes previos.' },

  // Dimensión: Creatividad
  { id: 'creatividad_q1', dimension: 'Creatividad', text: 'Genero nuevas ideas a partir de los contenidos aprendidos.' },
  { id: 'creatividad_q2', dimension: 'Creatividad', text: 'Propongo soluciones diferentes utilizando herramientas de IA generativa.' },
  { id: 'creatividad_q3', dimension: 'Creatividad', text: 'Combino diferentes ideas para crear propuestas originales.' },
  { id: 'creatividad_q4', dimension: 'Creatividad', text: 'Exploro nuevas formas de resolver problemas académicos.' },
  { id: 'creatividad_q5', dimension: 'Creatividad', text: 'Adapto los conocimientos aprendidos a nuevas situaciones.' }
];

function App() {
  // Estados Principales del Flujo (Cargados por Lazy Initialization para evitar cascading renders)
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = getLocalProgress();
    return saved?.currentStep || 'WELCOME';
  });
  const [demographics, setDemographics] = useState(() => {
    const saved = getLocalProgress();
    return saved?.demographics || null;
  });
  const [pretestAnswers, setPretestAnswers] = useState(() => {
    const saved = getLocalProgress();
    return saved?.pretestAnswers || {};
  });
  const [posttestAnswers, setPosttestAnswers] = useState(() => {
    const saved = getLocalProgress();
    return saved?.posttestAnswers || {};
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = getLocalProgress();
    return saved?.currentQuestionIndex !== undefined ? saved.currentQuestionIndex : 0;
  });
  const [participantId, setParticipantId] = useState(() => {
    const saved = getLocalProgress();
    return saved?.participantId || generateParticipantId();
  });
  
  // Estado de Sincronización y Carga
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, failed
  const [errorMsg, setErrorMsg] = useState('');

  // Estado de Vista de Administrador
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Estado del Modo Oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ia-survey-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Estado para capturar errores en producción/móvil
  const [runtimeErrors, setRuntimeErrors] = useState([]);

  useEffect(() => {
    const handleError = (message, source, lineno, colno, error) => {
      const errStr = `${message} (${source.split('/').pop()}:${lineno}:${colno})`;
      setRuntimeErrors(prev => [...new Set([...prev, errStr])]);
      return false;
    };
    const handleRejection = (event) => {
      const reason = event.reason;
      const errStr = `Promesa rechazada: ${reason?.message || reason || 'Error desconocido'}`;
      setRuntimeErrors(prev => [...new Set([...prev, errStr])]);
    };
    window.onerror = handleError;
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.onerror = null;
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Efecto: Manejo del Modo Oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ia-survey-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Efecto: Guardar progreso automáticamente
  useEffect(() => {
    if (currentStep !== 'RESULTS' && currentStep !== 'WELCOME') {
      saveLocalProgress({
        currentStep,
        demographics,
        pretestAnswers,
        posttestAnswers,
        currentQuestionIndex,
        participantId
      });
    }
  }, [currentStep, demographics, pretestAnswers, posttestAnswers, currentQuestionIndex, participantId]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Reiniciar la encuesta
  const handleResetSurvey = () => {
    if (window.confirm('¿Está seguro de que desea reiniciar la encuesta? Perderá el progreso actual.')) {
      clearLocalProgress();
      setDemographics(null);
      setPretestAnswers({});
      setPosttestAnswers({});
      setCurrentQuestionIndex(0);
      setParticipantId(generateParticipantId());
      setCurrentStep('WELCOME');
      setSyncStatus('idle');
      setErrorMsg('');
    }
  };

  // Guardar respuestas en Firebase al finalizar
  const handleSubmitSurvey = async (finalPayload) => {
    setSyncStatus('syncing');
    try {
      const res = await submitSurveyResponse(finalPayload);
      if (res.success) {
        setSyncStatus('synced');
        clearLocalProgress();
      }
    } catch (error) {
      setSyncStatus('failed');
      setErrorMsg(error.message || 'Error de conexión');
    }
  };

  // Avanzar en las preguntas del Likert
  const handleNextQuestion = () => {
    const isPretest = currentStep === 'PRETEST';
    const answers = isPretest ? pretestAnswers : posttestAnswers;
    const currentQuestion = QUESTIONS[currentQuestionIndex];

    // Validar que se haya contestado la pregunta actual
    if (answers[currentQuestion.id] === undefined) {
      alert('Por favor, seleccione una respuesta para continuar.');
      return;
    }

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalizó la fase actual
      if (isPretest) {
        setCurrentStep('VIDEO');
      } else {
        // Finalizó Posttest, preparar envío
        const payload = {
          participantId,
          demographics,
          pretest: pretestAnswers,
          posttest: posttestAnswers,
          createdAt: new Date().toISOString()
        };
        setCurrentStep('RESULTS');
        handleSubmitSurvey(payload);
      }
    }
  };

  // Retroceder en las preguntas del Likert o pantallas
  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      if (currentStep === 'PRETEST') {
        setCurrentStep('DEMOGRAPHICS');
      } else if (currentStep === 'POSTTEST') {
        setCurrentStep('VIDEO');
      }
    }
  };

  // Cambiar la respuesta en el estado local
  const handleAnswerSelect = (value) => {
    const isPretest = currentStep === 'PRETEST';
    if (isPretest) {
      setPretestAnswers(prev => ({
        ...prev,
        [QUESTIONS[currentQuestionIndex].id]: value
      }));
    } else {
      setPosttestAnswers(prev => ({
        ...prev,
        [QUESTIONS[currentQuestionIndex].id]: value
      }));
    }
  };



  // Renderizar la pantalla según el paso actual
  const renderStepContent = () => {
    if (isAdminView) {
      if (!adminUser) {
        return (
          <AdminLogin
            onLoginSuccess={(user) => setAdminUser(user)}
            onBack={() => setIsAdminView(false)}
          />
        );
      }
      return (
        <AdminDashboard
          onLogoutSuccess={() => setAdminUser(null)}
        />
      );
    }

    switch (currentStep) {
      case 'WELCOME':
        return <WelcomeScreen onStart={() => setCurrentStep('CONSENT')} />;
      
      case 'CONSENT':
        return (
          <ConsentForm
            onAccept={() => setCurrentStep('DEMOGRAPHICS')}
            onBack={() => setCurrentStep('WELCOME')}
          />
        );
      
      case 'DEMOGRAPHICS':
        return (
          <DemographicsForm
            initialData={demographics}
            onSave={(data) => {
              setDemographics(data);
              setCurrentStep('PRETEST');
              setCurrentQuestionIndex(0);
            }}
            onBack={() => setCurrentStep('CONSENT')}
          />
        );
      
      case 'PRETEST':
      case 'POSTTEST': {
        const isPretest = currentStep === 'PRETEST';
        const answers = isPretest ? pretestAnswers : posttestAnswers;
        const currentQuestion = QUESTIONS[currentQuestionIndex];
        const isAnswered = answers[currentQuestion.id] !== undefined;

        return (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={QUESTIONS.length}
              phase={currentStep}
            />
            
            <div>
              <LikertCard
                key={currentQuestion.id}
                question={currentQuestion}
                selectedValue={answers[currentQuestion.id]}
                onChange={handleAnswerSelect}
              />
            </div>

            {/* Controles del Cuestionario */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={handleBackQuestion}
                className="flex items-center gap-1 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold transition-colors cursor-pointer"
              >
                Atrás
              </button>
              
              <button
                type="button"
                disabled={!isAnswered}
                onClick={handleNextQuestion}
                className={`flex items-center gap-1.5 px-7 py-3 font-semibold rounded-xl text-white transition-all shadow-sm ${
                  isAnswered
                    ? 'bg-primary hover:bg-primary-hover hover:shadow cursor-pointer'
                    : 'bg-text-muted/30 cursor-not-allowed opacity-50'
                }`}
              >
                {currentQuestionIndex === QUESTIONS.length - 1 
                  ? (isPretest ? 'Finalizar Pretest' : 'Enviar Encuesta') 
                  : 'Siguiente'
                }
              </button>
            </div>
          </div>
        );
      }

      case 'VIDEO':
        return (
          <VideoTraining
            onComplete={() => {
              setCurrentStep('POSTTEST');
              setCurrentQuestionIndex(0);
            }}
            onBack={() => {
              setCurrentStep('PRETEST');
              setCurrentQuestionIndex(QUESTIONS.length - 1);
            }}
          />
        );

      case 'RESULTS':
        return (
          <ResultsScreen
            participantId={participantId}
            syncStatus={syncStatus}
            errorMsg={errorMsg}
            rawData={{
              participantId,
              demographics,
              pretest: pretestAnswers,
              posttest: posttestAnswers,
              createdAt: new Date().toISOString()
            }}
            onRetrySync={() => {
              handleSubmitSurvey({
                participantId,
                demographics,
                pretest: pretestAnswers,
                posttest: posttestAnswers,
                createdAt: new Date().toISOString()
              });
            }}
          />
        );

      default:
        return <WelcomeScreen onStart={() => setCurrentStep('CONSENT')} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-main flex flex-col font-sans transition-colors duration-300">
      {runtimeErrors.length > 0 && (
        <div className="bg-red-500 text-white p-3 text-xs font-mono z-50 sticky top-0 max-h-40 overflow-y-auto">
          <p className="font-bold border-b border-white/20 pb-1 mb-1">Errores detectados ({runtimeErrors.length}):</p>
          {runtimeErrors.map((err, i) => <div key={i}>{err}</div>)}
          <button onClick={() => setRuntimeErrors([])} className="mt-2 bg-white text-red-500 px-2 py-0.5 rounded font-sans font-bold">Cerrar</button>
        </div>
      )}
      {/* Header global minimalista */}
      <header className="relative md:sticky top-0 z-40 bg-card border-b border-border/50 py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-lg shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-text-main">
              Estudio Académico IA
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón de reinicio si no estamos en Welcome ni en Results */}
            {!isAdminView && currentStep !== 'WELCOME' && currentStep !== 'RESULTS' && (
              <button
                type="button"
                onClick={handleResetSurvey}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-surface border border-transparent hover:border-border text-text-muted hover:text-red-500 transition-all cursor-pointer"
                title="Reiniciar encuesta"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            )}

            {/* Toggle de Modo Oscuro */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-text-main transition-colors cursor-pointer"
              aria-label="Alternar modo oscuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-start md:justify-center py-6 md:py-10">
        {renderStepContent()}
      </main>

      {/* Footer minimalista */}
      <footer className="py-4 border-t border-border/50 text-center text-[10px] sm:text-xs text-text-muted bg-card/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Cuestionario Académico de Investigación sobre IA.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-1 sm:mt-0">
            <span className="hover:text-text-main transition-colors">Privacidad garantizada</span>
            <span className="w-1 h-1 bg-border rounded-full hidden sm:inline" />
            <span className="hover:text-text-main transition-colors">Respuestas Anónimas</span>
            <span className="w-1 h-1 bg-border rounded-full hidden sm:inline" />
            <button
              type="button"
              onClick={() => setIsAdminView(!isAdminView)}
              className="text-primary hover:underline cursor-pointer font-bold transition-colors"
            >
              {isAdminView ? 'Volver al Cuestionario' : 'Área del Administrador'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
