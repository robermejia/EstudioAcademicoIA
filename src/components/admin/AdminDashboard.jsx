import { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Database, Download, LogOut, Search, 
  ChevronRight, Calendar, Info, RefreshCw, CheckCircle, GraduationCap, Trash2,
  Award, FileText, Plus, X, ExternalLink, HelpCircle
} from 'lucide-react';
import { 
  getAllResponses, 
  clearAllResponses,
  getExpertEvaluations,
  submitExpertEvaluation,
  deleteExpertEvaluation
} from '../../lib/surveyService';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const EXPERT_ITEMS = [
  { id: 1, dimension: 'D1: Comprensión de contenidos', text: 'Soy capaz de explicar los conceptos aprendidos con mis propias palabras.' },
  { id: 2, dimension: 'D1: Comprensión de contenidos', text: 'Comprendo la relación entre los temas desarrollados durante la capacitación.' },
  { id: 3, dimension: 'D1: Comprensión de contenidos', text: 'Puedo aplicar los conocimientos aprendidos en ejercicios prácticos.' },
  { id: 4, dimension: 'D1: Comprensión de contenidos', text: 'Identifico con claridad las ideas principales del contenido presentado.' },
  { id: 5, dimension: 'D1: Comprensión de contenidos', text: 'Relaciono los nuevos conocimientos con aprendizajes previos.' },
  { id: 6, dimension: 'D2: Creatividad', text: 'Genero nuevas ideas a partir de los contenidos aprendidos.' },
  { id: 7, dimension: 'D2: Creatividad', text: 'Propongo soluciones diferentes utilizando herramientas de IA generativa.' },
  { id: 8, dimension: 'D2: Creatividad', text: 'Combino diferentes ideas para crear propuestas originales.' },
  { id: 9, dimension: 'D2: Creatividad', text: 'Exploro nuevas formas de resolver problemas académicos.' },
  { id: 10, dimension: 'D2: Creatividad', text: 'Adapto los conocimientos aprendidos a nuevas situaciones.' }
];

const SEED_EXPERTS = [
  {
    name: 'Dr. Carlos Mendoza',
    profession: 'Doctor en Educación y Tecnología',
    ratings: {
      '1': { clarity: 5, coherence: 5, relevance: 5, obs: 'Excelente claridad.' },
      '2': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '3': { clarity: 5, coherence: 4, relevance: 5, obs: '' },
      '4': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '5': { clarity: 4, coherence: 4, relevance: 5, obs: '' },
      '6': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '7': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '8': { clarity: 4, coherence: 5, relevance: 4, obs: '' },
      '9': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '10': { clarity: 5, coherence: 4, relevance: 5, obs: 'Relevante para el estudio.' }
    },
    isSeed: true
  },
  {
    name: 'Dra. Ana María Silva',
    profession: 'Investigadora en IA Educativa',
    ratings: {
      '1': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '2': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '3': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '4': { clarity: 4, coherence: 4, relevance: 5, obs: '' },
      '5': { clarity: 5, coherence: 5, relevance: 4, obs: '' },
      '6': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '7': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '8': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '9': { clarity: 5, coherence: 4, relevance: 5, obs: '' },
      '10': { clarity: 5, coherence: 5, relevance: 5, obs: '' }
    },
    isSeed: true
  },
  {
    name: 'Mg. Roberto Gómez',
    profession: 'Experto en Diseño Instruccional',
    ratings: {
      '1': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '2': { clarity: 5, coherence: 4, relevance: 5, obs: '' },
      '3': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '4': { clarity: 5, coherence: 5, relevance: 4, obs: '' },
      '5': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '6': { clarity: 4, coherence: 4, relevance: 5, obs: '' },
      '7': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '8': { clarity: 5, coherence: 5, relevance: 5, obs: '' },
      '9': { clarity: 4, coherence: 5, relevance: 5, obs: '' },
      '10': { clarity: 5, coherence: 5, relevance: 4, obs: '' }
    },
    isSeed: true
  }
];

const DIMENSIONS = [
  { key: 'chatgpt', label: 'ChatGPT', color: 'bg-blue-500', text: 'text-blue-500' },
  { key: 'gemini', label: 'Gemini', color: 'bg-sky-500', text: 'text-sky-500' },
  { key: 'copilot', label: 'Copilot', color: 'bg-indigo-500', text: 'text-indigo-500' },
  { key: 'comprension', label: 'Comprensión', color: 'bg-emerald-500', text: 'text-emerald-500' },
  { key: 'creatividad', label: 'Creatividad', color: 'bg-violet-500', text: 'text-violet-500' }
];

const QUESTIONS = [
  { id: 'chatgpt_q1', dimension: 'ChatGPT', text: 'ChatGPT me ayuda a comprender mejor los temas académicos.' },
  { id: 'chatgpt_q2', dimension: 'ChatGPT', text: 'Utilizo ChatGPT para resolver dudas relacionadas con mis estudios.' },
  { id: 'chatgpt_q3', dimension: 'ChatGPT', text: 'ChatGPT facilita mi aprendizaje de nuevos contenidos.' },
  { id: 'gemini_q1', dimension: 'Gemini', text: 'Gemini facilita la búsqueda de información académica.' },
  { id: 'gemini_q2', dimension: 'Gemini', text: 'Gemini me ayuda a organizar mejor mis ideas y contenidos.' },
  { id: 'gemini_q3', dimension: 'Gemini', text: 'Considero que Gemini mejora mi aprendizaje autónomo.' },
  { id: 'copilot_q1', dimension: 'Copilot', text: 'Copilot me ayuda a generar soluciones o ideas nuevas.' },
  { id: 'copilot_q2', dimension: 'Copilot', text: 'Copilot facilita el desarrollo de actividades académicas.' },
  { id: 'copilot_q3', dimension: 'Copilot', text: 'Considero que Copilot mejora mi productividad académica.' },
  { id: 'comprension_q1', dimension: 'Comprensión de contenidos', text: 'Soy capaz de explicar los conceptos aprendidos con mis propias palabras.' },
  { id: 'comprension_q2', dimension: 'Comprensión de contenidos', text: 'Comprendo la relación entre los temas desarrollados durante la capacitación.' },
  { id: 'comprension_q3', dimension: 'Comprensión de contenidos', text: 'Puedo aplicar los conocimientos aprendidos en ejercicios prácticos.' },
  { id: 'comprension_q4', dimension: 'Comprensión de contenidos', text: 'Identifico con claridad las ideas principales del contenido presentado.' },
  { id: 'comprension_q5', dimension: 'Comprensión de contenidos', text: 'Relaciono los nuevos conocimientos con aprendizajes previos.' },
  { id: 'creatividad_q1', dimension: 'Creatividad', text: 'Genero nuevas ideas a partir de los contenidos aprendidos.' },
  { id: 'creatividad_q2', dimension: 'Creatividad', text: 'Propongo soluciones diferentes utilizando herramientas de IA generativa.' },
  { id: 'creatividad_q3', dimension: 'Creatividad', text: 'Combino diferentes ideas para crear propuestas originales.' },
  { id: 'creatividad_q4', dimension: 'Creatividad', text: 'Exploro nuevas formas de resolver problemas académicos.' },
  { id: 'creatividad_q5', dimension: 'Creatividad', text: 'Adapto los conocimientos aprendidos a nuevas situaciones.' }
];

export function AdminDashboard({ onLogoutSuccess }) {
  // Pestaña Activa: 'contenido' (Aiken's V) o 'criterio' (Piloto)
  const [activeTab, setActiveTab] = useState('contenido');

  // Respuestas del Grupo Piloto
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null); // Detalle de un participante

  // Evaluaciones de Expertos
  const [expertEvaluations, setExpertEvaluations] = useState([]);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [newExpert, setNewExpert] = useState({
    name: '',
    profession: '',
    ratings: EXPERT_ITEMS.reduce((acc, item) => {
      acc[item.id] = { clarity: 5, coherence: 5, relevance: 5, obs: '' };
      return acc;
    }, {})
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar piloto
      const pilotData = await getAllResponses();
      pilotData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setResponses(pilotData);

      // Cargar expertos
      const expertData = await getExpertEvaluations();
      // Si no hay expertos en Firebase, inyectamos los datos semilla para visualización interactiva inmediata
      if (expertData.length === 0) {
        setExpertEvaluations(SEED_EXPERTS);
      } else {
        setExpertEvaluations(expertData);
      }
    } catch (err) {
      console.error(err);
      setError('Error al recuperar datos del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearDatabase = async () => {
    const confirmation = window.confirm(
      '¡ATENCIÓN! Esto eliminará permanentemente todas las respuestas registradas en la base de datos de Firebase.\n\n¿Está seguro de que desea continuar? Esta acción no se puede deshacer.'
    );
    
    if (confirmation) {
      const confirmWord = window.prompt(
        'Para confirmar la eliminación permanente, escriba la palabra "ELIMINAR" en mayúsculas:'
      );
      
      if (confirmWord === 'ELIMINAR') {
        setLoading(true);
        setError('');
        try {
          await clearAllResponses();
          alert('Base de datos vaciada con éxito.');
          await fetchData();
        } catch (err) {
          console.error(err);
          setError('Error al vaciar la base de datos de respuestas.');
          setLoading(false);
        }
      } else {
        alert('Confirmación cancelada o incorrecta. No se eliminó ningún dato.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogoutSuccess();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // --- CÁLCULO DE VALIDEZ DE CONTENIDO (AIKEN'S V) ---
  // Aiken's V formula: V = S / (n * (c - 1))
  // n = número de expertos, c = 5 (rango 1 a 5, c-1 = 4), S = sumatorio(r - 1)
  const calculateAikensV = (itemId, criterion) => {
    if (expertEvaluations.length === 0) return 0;
    const n = expertEvaluations.length;
    let sumS = 0;
    expertEvaluations.forEach(exp => {
      const score = exp.ratings?.[itemId]?.[criterion] || 5;
      sumS += (score - 1);
    });
    const maxPossibleS = n * 4;
    return maxPossibleS > 0 ? parseFloat((sumS / maxPossibleS).toFixed(2)) : 0;
  };

  const getAikensBadgeColor = (v) => {
    if (v >= 0.8) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
    if (v >= 0.7) return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200';
  };

  const getAikensStatus = (v) => {
    if (v >= 0.8) return 'Válido';
    if (v >= 0.7) return 'Aceptable';
    return 'Revaluar';
  };

  const getObservationsList = (itemId) => {
    return expertEvaluations
      .map(exp => {
        const obs = exp.ratings?.[itemId]?.obs || '';
        return obs.trim() ? `${exp.name}: "${obs}"` : '';
      })
      .filter(Boolean);
  };

  const handleSaveExpert = async (e) => {
    e.preventDefault();
    if (!newExpert.name.trim()) {
      alert('Por favor, introduzca el nombre del experto.');
      return;
    }

    try {
      setLoading(true);
      // Guardar en Firestore
      await submitExpertEvaluation(newExpert);
      // Recargar datos
      await fetchData();
      setIsExpertModalOpen(false);
      // Reset form
      setNewExpert({
        name: '',
        profession: '',
        ratings: EXPERT_ITEMS.reduce((acc, item) => {
          acc[item.id] = { clarity: 5, coherence: 5, relevance: 5, obs: '' };
          return acc;
        }, {})
      });
      alert('Evaluación de experto guardada con éxito.');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la evaluación.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpert = async (expert) => {
    if (expert.isSeed) {
      // Si es un dato semilla local, lo removemos del estado
      setExpertEvaluations(prev => prev.filter(e => e.name !== expert.name));
      return;
    }
    if (window.confirm(`¿Está seguro de que desea eliminar la evaluación del experto ${expert.name}?`)) {
      try {
        setLoading(true);
        await deleteExpertEvaluation(expert.id);
        await fetchData();
        alert('Evaluación eliminada correctamente.');
      } catch (err) {
        console.error(err);
        alert('Error al eliminar la evaluación.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- CÁLCULOS DEL GRUPO PILOTO (VALIDEZ DE CRITERIO) ---
  const totalParticipants = responses.length;
  
  const averageAge = totalParticipants > 0 
    ? (responses.reduce((sum, r) => sum + (r.demographics?.age || 0), 0) / totalParticipants).toFixed(1)
    : 0;

  const aiExperiencePercent = totalParticipants > 0
    ? Math.round((responses.filter(r => r.demographics?.hasUsedAI === 'yes').length / totalParticipants) * 100)
    : 0;

  const toolCounts = responses.reduce((acc, r) => {
    const tool = r.demographics?.mostUsedTool || 'Ninguna';
    acc[tool] = (acc[tool] || 0) + 1;
    return acc;
  }, {});

  const getToolPercent = (toolName) => {
    if (totalParticipants === 0) return 0;
    return Math.round(((toolCounts[toolName] || 0) / totalParticipants) * 100);
  };

  const getDimensionAverage = (dimensionKey, phase) => {
    if (totalParticipants === 0) return 0;
    
    const questionIds = {
      chatgpt: ['chatgpt_q1', 'chatgpt_q2', 'chatgpt_q3'],
      gemini: ['gemini_q1', 'gemini_q2', 'gemini_q3'],
      copilot: ['copilot_q1', 'copilot_q2', 'copilot_q3'],
      comprension: ['comprension_q1', 'comprension_q2', 'comprension_q3', 'comprension_q4', 'comprension_q5'],
      creatividad: ['creatividad_q1', 'creatividad_q2', 'creatividad_q3', 'creatividad_q4', 'creatividad_q5']
    }[dimensionKey];

    let totalSum = 0;
    let count = 0;

    responses.forEach(r => {
      const phaseAnswers = r[phase];
      if (phaseAnswers) {
        let sum = 0;
        let qCount = 0;
        questionIds.forEach(qId => {
          const val = phaseAnswers[qId];
          if (val !== undefined) {
            sum += val;
            qCount++;
          }
        });
        if (qCount > 0) {
          totalSum += (sum / qCount);
          count++;
        }
      }
    });

    return count > 0 ? parseFloat((totalSum / count).toFixed(2)) : 0;
  };

  const filteredResponses = responses.filter(r => {
    const search = searchQuery.toLowerCase();
    const idMatch = (r.participantId || '').toLowerCase().includes(search);
    const genderMatch = (r.demographics?.gender || '').toLowerCase().includes(search);
    const toolMatch = (r.demographics?.mostUsedTool || '').toLowerCase().includes(search);
    return idMatch || genderMatch || toolMatch;
  });

  const handleExportCSV = () => {
    if (responses.length === 0) return;
    
    const headers = [
      'ID Participante', 'Edad', 'Sexo', 'Uso previo IA', 'Herramienta favorita',
      ...QUESTIONS.map(q => `Pre_${q.id}`),
      ...QUESTIONS.map(q => `Post_${q.id}`),
      'Fecha Creacion'
    ];

    const rows = responses.map(r => {
      const d = r.demographics || {};
      const pre = r.pretest || {};
      const post = r.posttest || {};
      
      const preAnswers = QUESTIONS.map(q => pre[q.id] || '');
      const postAnswers = QUESTIONS.map(q => post[q.id] || '');
      
      return [
        r.participantId || r.id,
        d.age || '',
        d.gender || '',
        d.hasUsedAI || '',
        d.mostUsedTool || '',
        ...preAnswers,
        ...postAnswers,
        r.createdAt || ''
      ].map(val => `"${val}"`).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datos_cuestionario_ia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 min-w-0">
      {/* Barra de cabecera del Admin */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card border border-border/80 p-4 sm:p-6 rounded-3xl shadow-sm">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-1">
            Panel de Control Académico
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-text-main tracking-tight">
            Dashboard de Estadísticas
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button
            type="button"
            onClick={fetchData}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-surface hover:bg-surface-hover border border-border text-text-main text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar Datos
          </button>
          
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={totalParticipants === 0}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex-1 sm:flex-initial ${
              totalParticipants === 0 
                ? 'bg-text-muted/30 cursor-not-allowed opacity-50' 
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow cursor-pointer'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV Piloto
          </button>

          <button
            type="button"
            onClick={handleClearDatabase}
            disabled={totalParticipants === 0}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex-1 sm:flex-initial ${
              totalParticipants === 0
                ? 'bg-text-muted/30 cursor-not-allowed opacity-50'
                : 'bg-red-500 hover:bg-red-600 hover:shadow cursor-pointer'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar BD
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-border/80 gap-2">
        <button
          onClick={() => setActiveTab('contenido')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all rounded-t-xl border-t border-x -mb-px cursor-pointer ${
            activeTab === 'contenido'
              ? 'bg-card border-border text-primary border-b-bg-app'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Award className="w-4 h-4" />
          1. Validez de contenido (Aiken’s V)
        </button>
        <button
          onClick={() => setActiveTab('criterio')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all rounded-t-xl border-t border-x -mb-px cursor-pointer ${
            activeTab === 'criterio'
              ? 'bg-card border-border text-primary border-b-bg-app'
              : 'border-transparent text-text-muted hover:text-text-main'
          }`}
        >
          <Users className="w-4 h-4" />
          Validez de criterio (Grupo piloto de 20-30 personas)
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 text-center font-semibold">
          {error}
        </div>
      ) : activeTab === 'contenido' ? (
        // CONTENIDO DEL TAB DE VALIDEZ DE CONTENIDO (AIKEN'S V)
        <div className="space-y-8 animate-fadeIn">
          {/* Card Informativa del Instrumento */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wide">
                  Instrumento de Evaluación de Expertos
                </span>
                <h2 className="text-xl font-bold text-text-main mt-2">
                  Efectividad del Aprendizaje en Entornos Virtuales
                </h2>
              </div>
              <a
                href="https://form.typeform.com/to/Fs7JQV2i"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Formulario Online (Typeform)
              </a>
            </div>

            <p className="text-text-muted text-xs leading-relaxed max-w-4xl">
              El presente instrumento tiene como propósito evaluar la efectividad del aprendizaje en estudiantes de educación superior en entornos virtuales, en el marco de un estudio que analiza la influencia del uso de herramientas de inteligencia artificial generativa. La variable dependiente se mide a través de dos dimensiones: <strong>Comprensión de contenidos</strong> y <strong>Creatividad</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40 text-xs">
              <div>
                <span className="font-semibold text-text-main block mb-1">Criterios de Calificación (Escala 1 a 5):</span>
                <ul className="space-y-1 text-text-muted list-disc pl-4">
                  <li><strong>1 - Insuficiente / Nulo:</strong> No comprende y es incapaz de generar ideas.</li>
                  <li><strong>2 - En Inicio:</strong> Comprensión vaga o fragmentada. Repite conceptos.</li>
                  <li><strong>3 - En desarrollo:</strong> Comprende lo básico, aplica de forma estándar.</li>
                  <li><strong>4 - Logrado:</strong> Domina con claridad, crea o adapta con independencia.</li>
                  <li><strong>5 - Destacado:</strong> Dominio profundo, innova, crea nuevas perspectivas.</li>
                </ul>
              </div>
              <div className="bg-surface/50 border border-border/40 p-4 rounded-xl space-y-2">
                <span className="font-semibold text-text-main block">Estadísticas de Validez General</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Claridad Promedio</span>
                    <span className="text-sm font-extrabold text-primary">
                      {(EXPERT_ITEMS.reduce((sum, item) => sum + calculateAikensV(item.id, 'clarity'), 0) / 10).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Coherencia Promedio</span>
                    <span className="text-sm font-extrabold text-primary">
                      {(EXPERT_ITEMS.reduce((sum, item) => sum + calculateAikensV(item.id, 'coherence'), 0) / 10).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Relevancia Promedio</span>
                    <span className="text-sm font-extrabold text-primary">
                      {(EXPERT_ITEMS.reduce((sum, item) => sum + calculateAikensV(item.id, 'relevance'), 0) / 10).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-text-muted text-center italic mt-1">
                  * Un valor Aiken's V ≥ 0.80 indica una validez óptima del ítem.
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Aiken's V por Ítem */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Coeficiente Aiken's V por Ítem
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-1/3">Ítem / Pregunta</th>
                    <th className="py-3 px-4">Dimensión</th>
                    <th className="py-3 px-4 text-center">V (Claridad)</th>
                    <th className="py-3 px-4 text-center">V (Coherencia)</th>
                    <th className="py-3 px-4 text-center">V (Relevancia)</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4">Observaciones compiladas</th>
                  </tr>
                </thead>
                <tbody>
                  {EXPERT_ITEMS.map((item) => {
                    const vClarity = calculateAikensV(item.id, 'clarity');
                    const vCoherence = calculateAikensV(item.id, 'coherence');
                    const vRelevance = calculateAikensV(item.id, 'relevance');
                    const avgV = parseFloat(((vClarity + vCoherence + vRelevance) / 3).toFixed(2));
                    const obsList = getObservationsList(item.id);

                    return (
                      <tr key={item.id} className="border-b border-border/40 hover:bg-surface/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-center text-text-muted">{item.id}</td>
                        <td className="py-3 px-4 font-medium text-text-main">{item.text}</td>
                        <td className="py-3 px-4 text-text-muted font-semibold text-[10px]">{item.dimension}</td>
                        <td className="py-3 px-4 text-center font-bold font-mono">
                          <span className={`px-2 py-0.5 rounded border ${getAikensBadgeColor(vClarity)}`}>
                            {vClarity.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">
                          <span className={`px-2 py-0.5 rounded border ${getAikensBadgeColor(vCoherence)}`}>
                            {vCoherence.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">
                          <span className={`px-2 py-0.5 rounded border ${getAikensBadgeColor(vRelevance)}`}>
                            {vRelevance.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            avgV >= 0.8 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : avgV >= 0.7 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {getAikensStatus(avgV)}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate" title={obsList.join(' | ')}>
                          {obsList.length > 0 ? (
                            <span className="text-[10px] text-text-muted italic">{obsList[0]} {obsList.length > 1 && `(+${obsList.length - 1})`}</span>
                          ) : (
                            <span className="text-text-muted/40">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Listado y Registro de Expertos */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Evaluaciones de Expertos ({expertEvaluations.length})
                </h3>
                <p className="text-xs text-text-muted">Expertos registrados cuyos datos determinan la validez del Aiken's V anterior</p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpertModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar Evaluación de Experto
              </button>
            </div>

            {expertEvaluations.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No hay expertos registrados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expertEvaluations.map((exp, idx) => (
                  <div key={idx} className="border border-border/80 rounded-2xl p-4 bg-surface/40 space-y-3 relative group">
                    <button
                      onClick={() => handleDeleteExpert(exp)}
                      className="absolute top-3 right-3 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-surface border border-border rounded-lg"
                      title="Eliminar evaluación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <h4 className="font-extrabold text-sm text-text-main">{exp.name}</h4>
                      <p className="text-[10px] text-text-muted font-medium">{exp.profession || 'Profesional no especificado'}</p>
                    </div>
                    {exp.isSeed && (
                      <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200/50">
                        Dato Demostrativo
                      </span>
                    )}
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-border/30 text-center text-[10px]">
                      <div>
                        <span className="text-text-muted block">Claridad Prom</span>
                        <span className="font-bold text-text-main">
                          {(EXPERT_ITEMS.reduce((sum, item) => sum + (exp.ratings?.[item.id]?.clarity || 5), 0) / 10).toFixed(1)} / 5
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">Coherencia Prom</span>
                        <span className="font-bold text-text-main">
                          {(EXPERT_ITEMS.reduce((sum, item) => sum + (exp.ratings?.[item.id]?.coherence || 5), 0) / 10).toFixed(1)} / 5
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">Relevancia Prom</span>
                        <span className="font-bold text-text-main">
                          {(EXPERT_ITEMS.reduce((sum, item) => sum + (exp.ratings?.[item.id]?.relevance || 5), 0) / 10).toFixed(1)} / 5
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // CONTENIDO DEL TAB DE VALIDEZ DE CRITERIO (GRUPO PILOTO ACTUAL)
        <div className="space-y-8 animate-fadeIn">
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-text-muted block truncate">Participantes</span>
                <span className="text-xl sm:text-2xl font-black text-text-main">{totalParticipants}</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 rounded-xl shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-text-muted block truncate">Edad Promedio</span>
                <span className="text-xl sm:text-2xl font-black text-text-main truncate block">{averageAge} años</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 rounded-xl shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-text-muted block truncate">Uso Previo de IA</span>
                <span className="text-xl sm:text-2xl font-black text-text-main">{aiExperiencePercent}%</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 rounded-xl shrink-0">
                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-text-muted block truncate">ChatGPT Favorito</span>
                <span className="text-xl sm:text-2xl font-black text-text-main">{getToolPercent('ChatGPT')}%</span>
              </div>
            </div>
          </div>

          {/* Gráfico Comparativo Pretest vs Posttest */}
          <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold text-text-main">
                Efectividad: Comparativa Pretest vs. Posttest (Grupo Piloto)
              </h2>
            </div>
            
            {totalParticipants === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No hay respuestas registradas aún para generar estadísticas.</p>
            ) : (
              <div className="space-y-6">
                {DIMENSIONS.map((dim) => {
                  const preAvg = getDimensionAverage(dim.key, 'pretest');
                  const postAvg = getDimensionAverage(dim.key, 'posttest');
                  
                  const prePct = (preAvg / 5) * 100;
                  const postPct = (postAvg / 5) * 100;

                  return (
                    <div key={dim.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 pb-6 border-b border-border/55 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-bold text-text-main block">{dim.label}</span>
                        <span className="text-xs text-text-muted">Escala Likert (1 - 5)</span>
                      </div>
                      
                      <div className="md:col-span-3 space-y-2.5">
                        {/* Pretest */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Pretest</span>
                            <span className="font-bold text-text-main">{preAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div
                              className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${prePct}%` }}
                            />
                          </div>
                        </div>

                        {/* Posttest */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Posttest</span>
                            <span className={`font-bold ${dim.text}`}>{postAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div
                              className={`h-full ${dim.color} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${postPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Listado de Participantes */}
          <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-text-main flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Registros de Participación
              </h2>
              
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por ID, sexo, herramienta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs"
                />
              </div>
            </div>

            {filteredResponses.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">
                {responses.length === 0 ? 'No hay registros en la base de datos.' : 'No se encontraron resultados con ese criterio.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-text-muted font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">ID Participante</th>
                      <th className="py-3 px-4">Edad</th>
                      <th className="py-3 px-4">Sexo</th>
                      <th className="py-3 px-4">Uso de IA</th>
                      <th className="py-3 px-4">Herramienta Más Usada</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponses.map((r) => (
                      <tr 
                        key={r.id} 
                        className="border-b border-border/40 hover:bg-surface/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-primary select-all">
                          {r.participantId || 'S/N'}
                        </td>
                        <td className="py-3 px-4 font-medium">{r.demographics?.age || '-'}</td>
                        <td className="py-3 px-4 font-medium">{r.demographics?.gender || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            r.demographics?.hasUsedAI === 'yes'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {r.demographics?.hasUsedAI === 'yes' ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{r.demographics?.mostUsedTool || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(r)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300 hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer font-bold text-[10px]"
                          >
                            Ver Detalles
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Agregar Experto */}
      {isExpertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsExpertModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          <div className="relative bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl z-10 animate-scaleUp">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-main">
                  Registrar Evaluación de Experto
                </h3>
                <p className="text-xs text-text-muted">Por favor, complete las puntuaciones de 1 a 5 para Claridad, Coherencia y Relevancia en cada ítem.</p>
              </div>
              <button
                onClick={() => setIsExpertModalOpen(false)}
                className="p-1 px-2.5 hover:bg-surface border border-border rounded-lg text-text-muted hover:text-text-main text-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpert} className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main block">Nombre y apellido del experto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dr. Juan Pérez"
                    value={newExpert.name}
                    onChange={(e) => setNewExpert(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-main block">Profesión / Especialidad</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Doctor en Educación / Investigador"
                    value={newExpert.profession}
                    onChange={(e) => setNewExpert(prev => ({ ...prev, profession: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Items a evaluar */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 border-y border-border/40 py-4">
                {EXPERT_ITEMS.map((item) => {
                  const rating = newExpert.ratings[item.id];
                  
                  const handleRatingChange = (field, value) => {
                    setNewExpert(prev => ({
                      ...prev,
                      ratings: {
                        ...prev.ratings,
                        [item.id]: {
                          ...prev.ratings[item.id],
                          [field]: parseInt(value)
                        }
                      }
                    }));
                  };

                  const handleObsChange = (value) => {
                    setNewExpert(prev => ({
                      ...prev,
                      ratings: {
                        ...prev.ratings,
                        [item.id]: {
                          ...prev.ratings[item.id],
                          obs: value
                        }
                      }
                    }));
                  };

                  return (
                    <div key={item.id} className="p-3 bg-surface/50 border border-border/40 rounded-xl space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          Ítem {item.id} - {item.dimension}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-text-main">{item.text}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center pt-2">
                        {/* Claridad */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-text-muted">Claridad (1-5)</label>
                          <select
                            value={rating.clarity}
                            onChange={(e) => handleRatingChange('clarity', e.target.value)}
                            className="bg-card text-text-main text-xs border border-border rounded-lg p-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                          >
                            {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        {/* Coherencia */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-text-muted">Coherencia (1-5)</label>
                          <select
                            value={rating.coherence}
                            onChange={(e) => handleRatingChange('coherence', e.target.value)}
                            className="bg-card text-text-main text-xs border border-border rounded-lg p-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                          >
                            {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        {/* Relevancia */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-text-muted">Relevancia (1-5)</label>
                          <select
                            value={rating.relevance}
                            onChange={(e) => handleRatingChange('relevance', e.target.value)}
                            className="bg-card text-text-main text-xs border border-border rounded-lg p-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                          >
                            {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        {/* Observaciones */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-text-muted">Observaciones</label>
                          <input
                            type="text"
                            placeholder="Comentario opcional"
                            value={rating.obs}
                            onChange={(e) => handleObsChange(e.target.value)}
                            className="bg-card text-text-main text-xs border border-border rounded-lg p-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpertModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-main font-semibold text-xs rounded-xl hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
                >
                  Guardar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Participante */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedResponse(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          <div
            className="relative bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 md:p-8 shadow-xl z-10 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block truncate">
                  ID Registro: {selectedResponse.id}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-text-main truncate">
                  Participante: <span className="font-mono text-primary select-all">{selectedResponse.participantId}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 px-3 hover:bg-surface border border-border rounded-lg text-text-muted hover:text-text-main text-xs transition-colors cursor-pointer shrink-0"
              >
                Cerrar
              </button>
            </div>

            {/* Información Demográfica */}
            <div className="bg-surface border border-border/50 rounded-2xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Edad:</span>
                <span className="font-bold text-text-main">{selectedResponse.demographics?.age} años</span>
              </div>
              <div>
                <span className="text-text-muted block">Sexo:</span>
                <span className="font-bold text-text-main">{selectedResponse.demographics?.gender}</span>
              </div>
              <div>
                <span className="text-text-muted block">Uso Previo IA:</span>
                <span className="font-bold text-text-main">{selectedResponse.demographics?.hasUsedAI === 'yes' ? 'Sí' : 'No'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Herramienta:</span>
                <span className="font-bold text-text-main">{selectedResponse.demographics?.mostUsedTool}</span>
              </div>
            </div>

            {/* Respuestas comparativas de las preguntas */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-text-main border-b border-border/60 pb-2">
                Puntuaciones de Preguntas (Pretest vs. Posttest)
              </h4>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {QUESTIONS.map((q) => {
                  const preVal = selectedResponse.pretest?.[q.id] || '-';
                  const postVal = selectedResponse.posttest?.[q.id] || '-';
                  
                  return (
                    <div key={q.id} className="text-xs flex flex-col sm:flex-row justify-between gap-2 py-2 border-b border-border/30 last:border-0">
                      <div className="sm:max-w-md">
                        <span className="text-[9px] font-semibold text-primary/70 block uppercase tracking-wider">{q.dimension}</span>
                        <span className="text-text-main font-medium">{q.text}</span>
                      </div>
                      <div className="flex gap-4 shrink-0 sm:self-center font-semibold">
                        <span className="text-text-muted">Pre: <span className="text-text-main font-bold bg-surface px-2 py-0.5 rounded border border-border">{preVal}</span></span>
                        <span className="text-text-muted">Post: <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{postVal}</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedResponse.systemInfo && (
              <div className="mt-6 pt-4 border-t border-border/50 text-[10px] text-text-muted text-left flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>Soporte: {selectedResponse.systemInfo.userAgent} ({selectedResponse.systemInfo.screenSize})</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
