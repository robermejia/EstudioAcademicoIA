import { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Database, Download, LogOut, Search, 
  ChevronRight, Calendar, Info, RefreshCw, CheckCircle, GraduationCap, Trash2, Activity,
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

function probit(p) {
  if (p < 0.5) {
    const t = Math.sqrt(-2.0 * Math.log(p));
    return -(t - ((2.515517 + 0.802853 * t + 0.010328 * t * t) /
                 (1.0 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t)));
  } else {
    const t = Math.sqrt(-2.0 * Math.log(1.0 - p));
    return t - ((2.515517 + 0.802853 * t + 0.010328 * t * t) /
                (1.0 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t));
  }
}

function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804 * Math.exp(-x * x / 2);
  const prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - prob : prob;
}

function calculateShapiroWilk(data) {
  const n = data.length;
  if (n < 3) return { W: null, p: null };
  
  const sorted = [...data].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
  const denominator = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  if (denominator === 0) return { W: 1, p: 1 };

  const m = [];
  let sumMSq = 0;
  for (let i = 1; i <= n; i++) {
    const p = (i - 0.375) / (n + 0.25);
    const val = probit(p);
    m.push(val);
    sumMSq += val * val;
  }
  
  const sqrtSumMSq = Math.sqrt(sumMSq);
  const a = m.map(val => val / sqrtSumMSq);

  let numSum = 0;
  for (let i = 0; i < n; i++) {
    numSum += a[i] * sorted[i];
  }
  const W = Math.pow(numSum, 2) / denominator;

  const y = Math.log(1 - W);
  const u = Math.log(n);
  
  const m_mean = -2.706056 + 3.000104 * u - 2.010671 * Math.pow(u, 2) + 0.701389 * Math.pow(u, 3) - 0.090231 * Math.pow(u, 4);
  const m_sd = Math.exp(-2.235948 + 0.901006 * u - 0.063587 * Math.pow(u, 2) - 0.029312 * Math.pow(u, 3) + 0.00787 * Math.pow(u, 4));
  
  const z = (y - m_mean) / m_sd;
  const p = 1 - normalCDF(z);
  return { W: W, p: p };
}

function calculateTTestPValue(t, df) {
  if (df > 100) {
    return 2 * (1 - normalCDF(Math.abs(t)));
  }
  const ab = Math.abs(t);
  const w = ab / Math.sqrt(df);
  const th = Math.atan(w);
  if (df === 1) return 1.0 - 2.0 * th / Math.PI;
  
  let sm = Math.sin(th);
  let cp = Math.cos(th);
  if (df % 2 === 1) {
    let pr = sm;
    let tr = sm;
    for (let i = 3; i <= df - 2; i += 2) {
      tr = tr * cp * cp * (i - 1) / i;
      pr += tr;
    }
    return 1.0 - 2.0 * (th + pr * cp) / Math.PI;
  } else {
    let pr = 1.0;
    let tr = 1.0;
    for (let i = 2; i <= df - 2; i += 2) {
      tr = tr * cp * cp * (i - 1) / i;
      pr += tr;
    }
    return 1.0 - pr * sm;
  }
}

function calculateLevene(group1, group2) {
  const n1 = group1.length;
  const n2 = group2.length;
  const N = n1 + n2;
  if (n1 < 2 || n2 < 2) return { F: null, p: null };

  const mean1 = group1.reduce((s, v) => s + v, 0) / n1;
  const mean2 = group2.reduce((s, v) => s + v, 0) / n2;

  const z1 = group1.map(v => Math.abs(v - mean1));
  const z2 = group2.map(v => Math.abs(v - mean2));

  const zMean1 = z1.reduce((s, v) => s + v, 0) / n1;
  const zMean2 = z2.reduce((s, v) => s + v, 0) / n2;
  const zGrandMean = (z1.reduce((s, v) => s + v, 0) + z2.reduce((s, v) => s + v, 0)) / N;

  const ssBetween = n1 * Math.pow(zMean1 - zGrandMean, 2) + n2 * Math.pow(zMean2 - zGrandMean, 2);
  const ssWithin = z1.reduce((s, v) => s + Math.pow(v - zMean1, 2), 0) + z2.reduce((s, v) => s + Math.pow(v - zMean2, 2), 0);

  const df1 = 1;
  const df2 = N - 2;

  const msBetween = ssBetween / df1;
  const msWithin = ssWithin / df2;

  const F = msWithin > 0 ? msBetween / msWithin : 0;
  const t = Math.sqrt(F);
  const p = calculateTTestPValue(t, df2);

  return { F: F, p: p };
}

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

  const [selectedExpertCriterion, setSelectedExpertCriterion] = useState('clarity'); // clarity, coherence, relevance
  const [selectedItemObservations, setSelectedItemObservations] = useState(null); // { itemNumber, itemText, observations }

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

  const getExpertAvg = (exp, criterion) => {
    let sum = 0;
    EXPERT_ITEMS.forEach(item => {
      sum += exp.ratings?.[item.id]?.[criterion] || 5;
    });
    return parseFloat((sum / EXPERT_ITEMS.length).toFixed(2));
  };

  const getItemCriterionAvg = (itemId, criterion) => {
    if (expertEvaluations.length === 0) return 0;
    let sum = 0;
    expertEvaluations.forEach(exp => {
      sum += exp.ratings?.[itemId]?.[criterion] || 5;
    });
    return parseFloat((sum / expertEvaluations.length).toFixed(2));
  };

  const getGlobalExpertAvg = (criterion) => {
    if (expertEvaluations.length === 0) return 0;
    let sum = 0;
    expertEvaluations.forEach(exp => {
      EXPERT_ITEMS.forEach(item => {
        sum += exp.ratings?.[item.id]?.[criterion] || 5;
      });
    });
    return parseFloat((sum / (expertEvaluations.length * EXPERT_ITEMS.length)).toFixed(2));
  };

  const expertScoreColor = (val) => {
    if (val === null || val === undefined || val === '-') return '';
    const n = parseFloat(val);
    if (n >= 4.5) return 'text-emerald-600 dark:text-emerald-400 font-extrabold';
    if (n >= 3.5) return 'text-blue-600 dark:text-blue-400 font-bold';
    if (n >= 2.5) return 'text-amber-600 dark:text-amber-400 font-bold';
    return 'text-rose-600 dark:text-rose-400 font-bold';
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

  const getOverallPhaseAverage = (phase) => {
    if (totalParticipants === 0) return 0;
    let sum = 0;
    let count = 0;
    responses.forEach(r => {
      const answers = r[phase];
      if (answers) {
        QUESTIONS.forEach(q => {
          const val = answers[q.id];
          if (val !== undefined) {
            sum += val;
            count++;
          }
        });
      }
    });
    return count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
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
                        <td className="py-3 px-4">
                          {obsList.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setSelectedItemObservations({ itemNumber: item.id, itemText: item.text, observations: obsList })}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-border hover:border-primary/40 hover:bg-primary/5 text-primary rounded-lg transition-colors cursor-pointer text-[10px] font-bold"
                            >
                              <HelpCircle className="w-3 h-3" />
                              {obsList.length} {obsList.length === 1 ? 'obs.' : 'obs.'}
                            </button>
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

          {/* Tabla de Calificaciones por Experto (Matriz Completa con Coeficiente Aiken's V) */}
          {expertEvaluations.length > 0 && (
            <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-bold text-text-main">
                    Matriz de Puntuaciones de Expertos y Coeficiente Aiken's V
                  </h3>
                </div>
                
                {/* Selector de Criterio de Aiken */}
                <div className="flex bg-surface border border-border rounded-xl p-1 gap-1">
                  {[
                    { key: 'clarity', label: 'Claridad' },
                    { key: 'coherence', label: 'Coherencia' },
                    { key: 'relevance', label: 'Relevancia' }
                  ].map(crit => (
                    <button
                      key={crit.key}
                      type="button"
                      onClick={() => setSelectedExpertCriterion(crit.key)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedExpertCriterion === crit.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-muted hover:text-text-main'
                      }`}
                    >
                      {crit.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-text-muted mb-4">
                Calificaciones de cada experto (escala 1–5) para la validez de contenido de la **Variable 2 (dependiente): Efectividad del Aprendizaje**. La fila final de **Aiken's V** muestra el coeficiente de validez calculado para cada ítem.
              </p>

              <div className="overflow-x-auto">
                <table className="text-[10px] border-collapse min-w-max w-full">
                  <thead>
                    {/* Fila de dimensiones */}
                    <tr>
                      <th className="py-2 px-3 border border-border/60 bg-surface font-bold text-text-muted text-left" rowSpan={2}>EXPERTO / JUEZ</th>
                      {['D1: Comprensión de contenidos', 'D2: Creatividad'].map(dim => {
                        const count = EXPERT_ITEMS.filter(item => item.dimension.includes(dim.split(':')[0])).length;
                        return (
                          <th
                            key={dim}
                            colSpan={count}
                            className="py-1.5 px-2 border border-border/60 text-center font-extrabold uppercase tracking-wide bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300"
                          >
                            {dim}
                          </th>
                        );
                      })}
                      <th className="py-1.5 px-2 border border-border/60 text-center font-extrabold uppercase tracking-wide bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300" rowSpan={2}>
                        PROM.
                      </th>
                    </tr>
                    {/* Fila de ítems */}
                    <tr>
                      {EXPERT_ITEMS.map((item) => (
                        <th key={item.id} className="py-1.5 px-2 border border-border/60 bg-surface text-center font-bold text-text-muted whitespace-nowrap" title={item.text}>
                          Ítem {item.id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expertEvaluations.map((exp, idx) => {
                      const rowAvg = getExpertAvg(exp, selectedExpertCriterion);
                      return (
                        <tr key={idx} className={`border-b border-border/30 ${idx % 2 === 0 ? 'bg-surface/20' : ''} hover:bg-primary/5 transition-colors`}>
                          <td className="py-1.5 px-3 border border-border/40 font-bold text-text-main whitespace-nowrap">
                            <div>{exp.name}</div>
                            <div className="text-[8px] text-text-muted font-normal">{exp.profession}</div>
                          </td>
                          {EXPERT_ITEMS.map(item => {
                            const val = exp.ratings?.[item.id]?.[selectedExpertCriterion];
                            return (
                              <td key={item.id} className={`py-1.5 px-2 border border-border/30 text-center font-semibold ${expertScoreColor(val)}`}>
                                {val !== undefined ? val : 5}
                              </td>
                            );
                          })}
                          <td className="py-1.5 px-2 border border-border/40 text-center font-extrabold text-primary dark:text-sky-300">
                            {rowAvg} / 5.0
                          </td>
                        </tr>
                      );
                    })}

                    {/* Fila del Coeficiente Aiken's V */}
                    <tr className="bg-primary/5 border-t-2 border-primary/30 font-bold">
                      <td className="py-2 px-3 border border-border/60 font-extrabold uppercase tracking-wider text-primary dark:text-sky-300">
                        COEFICIENTE AIKEN'S V
                      </td>
                      {EXPERT_ITEMS.map(item => {
                        const vVal = calculateAikensV(item.id, selectedExpertCriterion);
                        return (
                          <td key={item.id} className="py-2 px-2 border border-border/40 text-center font-extrabold font-mono">
                            <span className={`px-2 py-0.5 rounded border text-[10px] ${getAikensBadgeColor(vVal)}`}>
                              {vVal.toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2 px-2 border border-border/40 text-center font-extrabold text-xs text-primary dark:text-sky-300 font-mono">
                        {(EXPERT_ITEMS.reduce((sum, item) => sum + calculateAikensV(item.id, selectedExpertCriterion), 0) / 10).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Leyenda de Aiken */}
              <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-text-muted">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> V ≥ 0.80 Válido (Óptimo)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> 0.70 ≤ V &lt; 0.80 Aceptable</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span> V &lt; 0.70 Revaluar ítem</span>
              </div>
            </div>
          )}

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
          {/* Card Informativa de Validez de Criterio */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-lg uppercase tracking-wide">
                  Validez de Criterio (Grupo Piloto)
                </span>
                <h2 className="text-xl font-bold text-text-main mt-2">
                  Estudio Piloto de Efectividad del Aprendizaje y Herramientas de IA Generativas
                </h2>
              </div>
              <a
                href={window.location.origin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ir al Cuestionario
              </a>
            </div>

            <p className="text-text-muted text-xs leading-relaxed max-w-4xl">
              Esta sección recopila y analiza los resultados obtenidos del grupo piloto de 20 a 30 participantes. El estudio tiene como propósito evaluar el impacto de las herramientas de inteligencia artificial generativa. Los participantes responden cuestionarios en dos fases para medir el cambio en su nivel de aprendizaje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40 text-xs">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-text-main block mb-1">Procedimiento de Medición:</span>
                  <ul className="space-y-1 text-text-muted list-disc pl-4">
                    <li><strong>Participantes:</strong> Estudiantes de educación superior virtual.</li>
                    <li><strong>Fases de Evaluación:</strong> Pretest (inicial) y Posttest (final).</li>
                    <li><strong>Estímulo intermedio:</strong> Video de capacitación sobre inteligencia artificial generativa.</li>
                    <li><strong>Escala de respuestas:</strong> Escala Likert de 1 a 5 para medir autopercepción.</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border/20">
                  <span className="font-semibold text-text-main block mb-1">Variables del Estudio:</span>
                  <ul className="space-y-1 text-text-muted list-none pl-1">
                    <li>
                      <strong>Variable 1 (independiente):</strong> Herramientas de IA generativas.
                      <span className="block pl-3 text-[10px] text-text-muted">Dimensiones: D1: ChatGPT Education, D2: Gemini, D3: Copilot</span>
                    </li>
                    <li className="mt-1.5">
                      <strong>Variable 2 (dependiente):</strong> Efectividad del aprendizaje.
                      <span className="block pl-3 text-[10px] text-text-muted">Dimensiones: D1: Comprensión de contenidos, D2: Creatividad</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-surface/50 border border-border/40 p-4 rounded-xl space-y-2">
                <span className="font-semibold text-text-main block">Estadísticas de Participación General</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Participantes</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {totalParticipants}
                    </span>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Promedio Pretest</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {getOverallPhaseAverage('pretest').toFixed(2)} / 5
                    </span>
                  </div>
                  <div className="bg-card p-2 rounded-lg border border-border/60">
                    <span className="text-[10px] text-text-muted block">Promedio Posttest</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {getOverallPhaseAverage('posttest').toFixed(2)} / 5
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-text-muted text-center italic mt-1">
                  * Evalúa la efectividad del aprendizaje desde la percepción del estudiante.
                </div>
              </div>
            </div>
          </div>

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

          {/* ── GRÁFICO V1: Variable Independiente ── */}
          <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg sm:text-xl font-bold text-text-main">
                  Variable 1 (independiente): Herramientas de IA Generativas
                </h2>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                V1 — Independiente
              </span>
            </div>
            <p className="text-xs text-text-muted mb-6 max-w-2xl">
              Mide la <strong>autopercepción del uso</strong> de cada herramienta de IA antes y después de la capacitación.
              Dimensiones: <strong>D1 ChatGPT Education · D2 Gemini · D3 Copilot</strong>
            </p>

            {totalParticipants === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No hay respuestas registradas aún.</p>
            ) : (
              <div className="space-y-6">
                {DIMENSIONS.filter(d => ['chatgpt', 'gemini', 'copilot'].includes(d.key)).map((dim, i) => {
                  const preAvg = getDimensionAverage(dim.key, 'pretest');
                  const postAvg = getDimensionAverage(dim.key, 'posttest');
                  const diff = parseFloat((postAvg - preAvg).toFixed(2));
                  const prePct = (preAvg / 5) * 100;
                  const postPct = (postAvg / 5) * 100;
                  const labels = ['D1', 'D2', 'D3'];

                  return (
                    <div key={dim.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 pb-6 border-b border-border/40 last:border-b-0 last:pb-0">
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block">{labels[i]}</span>
                        <span className="font-bold text-text-main block">{dim.label}</span>
                        <span className="text-xs text-text-muted">Escala Likert (1 – 5)</span>
                        {diff !== 0 && (
                          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'}`}>
                            {diff > 0 ? `▲ +${diff}` : `▼ ${diff}`}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-3 space-y-2.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Pretest</span>
                            <span className="font-bold text-text-main">{preAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${prePct}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Posttest</span>
                            <span className={`font-bold ${dim.text}`}>{postAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div className={`h-full ${dim.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${postPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── GRÁFICO V2: Variable Dependiente ── */}
          <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg sm:text-xl font-bold text-text-main">
                  Variable 2 (dependiente): Efectividad del Aprendizaje
                </h2>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                V2 — Dependiente
              </span>
            </div>
            <p className="text-xs text-text-muted mb-6 max-w-2xl">
              Mide el <strong>nivel de aprendizaje efectivo</strong> del participante antes y después del estímulo (video de capacitación).
              Dimensiones: <strong>D1 Comprensión de contenidos · D2 Creatividad</strong>
            </p>

            {totalParticipants === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No hay respuestas registradas aún.</p>
            ) : (
              <div className="space-y-6">
                {DIMENSIONS.filter(d => ['comprension', 'creatividad'].includes(d.key)).map((dim, i) => {
                  const preAvg = getDimensionAverage(dim.key, 'pretest');
                  const postAvg = getDimensionAverage(dim.key, 'posttest');
                  const diff = parseFloat((postAvg - preAvg).toFixed(2));
                  const prePct = (preAvg / 5) * 100;
                  const postPct = (postAvg / 5) * 100;
                  const labels = ['D1', 'D2'];

                  return (
                    <div key={dim.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 pb-6 border-b border-border/40 last:border-b-0 last:pb-0">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest block">{labels[i]}</span>
                        <span className="font-bold text-text-main block">{dim.label}</span>
                        <span className="text-xs text-text-muted">Escala Likert (1 – 5)</span>
                        {diff !== 0 && (
                          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'}`}>
                            {diff > 0 ? `▲ +${diff}` : `▼ ${diff}`}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-3 space-y-2.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Pretest</span>
                            <span className="font-bold text-text-main">{preAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${prePct}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Posttest</span>
                            <span className={`font-bold ${dim.text}`}>{postAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <div className={`h-full ${dim.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${postPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Nota metodológica */}
            {totalParticipants > 0 && (
              <div className="mt-6 pt-4 border-t border-border/40 flex items-start gap-2 text-[10px] text-text-muted">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                <p>
                  Un incremento en el Posttest respecto al Pretest en las dimensiones <strong>Comprensión</strong> y <strong>Creatividad</strong> indica que 
                  el uso de herramientas de IA generativa tuvo un <strong>efecto positivo</strong> sobre la efectividad del aprendizaje.
                </p>
              </div>
            )}
          </div>

          {/* ── VERIFICACIÓN DE SUPUESTOS ── */}
          {responses.length > 0 && (() => {
            const pretestScores = responses.map(r => {
              let sum = 0, count = 0;
              QUESTIONS.forEach(q => {
                const v = r.pretest?.[q.id];
                if (v !== undefined) { sum += v; count++; }
              });
              return count > 0 ? sum / count : null;
            }).filter(val => val !== null);

            const posttestScores = responses.map(r => {
              let sum = 0, count = 0;
              QUESTIONS.forEach(q => {
                const v = r.posttest?.[q.id];
                if (v !== undefined) { sum += v; count++; }
              });
              return count > 0 ? sum / count : null;
            }).filter(val => val !== null);

            const shapiroPre = calculateShapiroWilk(pretestScores);
            const shapiroPost = calculateShapiroWilk(posttestScores);
            const leveneResult = calculateLevene(pretestScores, posttestScores);

            const isPreNormal = shapiroPre.p !== null && shapiroPre.p > 0.05;
            const isPostNormal = shapiroPost.p !== null && shapiroPost.p > 0.05;
            const isHomocedastic = leveneResult.p !== null && leveneResult.p > 0.05;

            return (
              <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg sm:text-xl font-bold text-text-main">
                      Verificación de Supuestos Estadísticos (Cálculo en Tiempo Real)
                    </h2>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                    Análisis Paramétrico
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-6 max-w-3xl">
                  Evaluación dinámica de los supuestos requeridos para el uso de estadística paramétrica (como la prueba t de Student para muestras emparejadas), calculados sobre el promedio de todas las preguntas de cada participante en el Pretest y Posttest.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 1. Prueba de Normalidad */}
                  <div className="bg-surface/30 border border-border/50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border/40">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold text-xs">
                        1
                      </span>
                      <h3 className="font-bold text-sm text-text-main">Prueba de Normalidad (Shapiro-Wilk)</h3>
                    </div>
                    <p className="text-xs text-text-muted">
                      Determina si las puntuaciones promedio de los participantes provienen de una población con distribución normal.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-border/80 text-text-muted font-bold">
                            <th className="py-2 pr-2">Variable / Fase</th>
                            <th className="py-2 px-2 text-center">Estadístico W</th>
                            <th className="py-2 px-2 text-center">p-valor</th>
                            <th className="py-2 pl-2 text-right">Interpretación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          <tr>
                            <td className="py-2.5 pr-2 font-semibold text-text-main">Pretest (Averaje General)</td>
                            <td className="py-2.5 px-2 text-center font-mono">{shapiroPre.W !== null ? shapiroPre.W.toFixed(4) : '—'}</td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold ${isPreNormal ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {shapiroPre.p !== null ? shapiroPre.p.toFixed(4) : '—'}
                            </td>
                            <td className="py-2.5 pl-2 text-right text-text-muted">
                              {shapiroPre.p === null ? 'Datos insuficientes' : isPreNormal ? 'Distribución Normal (p > 0.05)' : 'No Normal (p ≤ 0.05)'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 pr-2 font-semibold text-text-main">Posttest (Averaje General)</td>
                            <td className="py-2.5 px-2 text-center font-mono">{shapiroPost.W !== null ? shapiroPost.W.toFixed(4) : '—'}</td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold ${isPostNormal ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {shapiroPost.p !== null ? shapiroPost.p.toFixed(4) : '—'}
                            </td>
                            <td className="py-2.5 pl-2 text-right text-text-muted">
                              {shapiroPost.p === null ? 'Datos insuficientes' : isPostNormal ? 'Distribución Normal (p > 0.05)' : 'No Normal (p ≤ 0.05)'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className={`border rounded-xl p-3 flex items-start gap-2.5 ${isPreNormal && isPostNormal ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isPreNormal && isPostNormal ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <div className="text-[10px] text-text-muted leading-relaxed">
                        <strong>Conclusión:</strong> {isPreNormal && isPostNormal 
                          ? 'Al ser los p-valores mayores a 0.05, se acepta la hipótesis nula (H₀). Las puntuaciones promedio del grupo piloto siguen una distribución normal, validando el uso de estadística paramétrica.'
                          : 'Al menos una de las fases presenta un p-valor menor o igual a 0.05, lo que sugiere el uso de pruebas no paramétricas (como Wilcoxon).'}
                      </div>
                    </div>
                  </div>

                  {/* 2. Prueba de Igualdad de Varianzas */}
                  <div className="bg-surface/30 border border-border/50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border/40">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold text-xs">
                        2
                      </span>
                      <h3 className="font-bold text-sm text-text-main">Prueba de Homocedasticidad (Prueba de Levene)</h3>
                    </div>
                    <p className="text-xs text-text-muted">
                      Evalúa si las varianzas de las puntuaciones de todas las preguntas en el Pretest y Posttest son homogéneas.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-border/80 text-text-muted font-bold">
                            <th className="py-2 pr-2">Comparación</th>
                            <th className="py-2 px-2 text-center">Estadístico F</th>
                            <th className="py-2 px-2 text-center">p-valor</th>
                            <th className="py-2 pl-2 text-right">Interpretación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          <tr>
                            <td className="py-2.5 pr-2 font-semibold text-text-main">Pretest vs Posttest</td>
                            <td className="py-2.5 px-2 text-center font-mono">{leveneResult.F !== null ? leveneResult.F.toFixed(4) : '—'}</td>
                            <td className={`py-2.5 px-2 text-center font-mono font-bold ${isHomocedastic ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {leveneResult.p !== null ? leveneResult.p.toFixed(4) : '—'}
                            </td>
                            <td className="py-2.5 pl-2 text-right text-text-muted">
                              {leveneResult.p === null ? 'Datos insuficientes' : isHomocedastic ? 'Varianzas Iguales (p > 0.05)' : 'Varianzas Diferentes (p ≤ 0.05)'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className={`border rounded-xl p-3 flex items-start gap-2.5 ${isHomocedastic ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isHomocedastic ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <div className="text-[10px] text-text-muted leading-relaxed">
                        <strong>Conclusión:</strong> {isHomocedastic
                          ? 'Al ser el p-valor mayor a 0.05, se acepta la hipótesis nula de igualdad de varianzas. Se cumple satisfactoriamente el supuesto de homocedasticidad.'
                          : 'Al ser el p-valor menor o igual a 0.05, se rechaza la hipótesis nula. Se sugiere heterocedasticidad.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── TABLA GLOBAL DE PUNTUACIONES POR PREGUNTA (estilo Excel) ── */}
          {responses.length > 0 && (() => {
            const phases = [
              { key: 'pretest', label: 'PRETEST', color: 'bg-slate-500', headerBg: 'bg-slate-100 dark:bg-slate-800', textColor: 'text-slate-700 dark:text-slate-200' },
              { key: 'posttest', label: 'POSTTEST', color: 'bg-primary', headerBg: 'bg-primary/10 dark:bg-primary/20', textColor: 'text-primary dark:text-sky-300' }
            ];

            const getParticipantQuestionAvg = (r, phase) => {
              let sum = 0, count = 0;
              QUESTIONS.forEach(q => {
                const v = r[phase]?.[q.id];
                if (v !== undefined) { sum += v; count++; }
              });
              return count > 0 ? parseFloat((sum / count).toFixed(2)) : null;
            };

            const getColumnAvg = (phase, qId) => {
              let sum = 0, count = 0;
              responses.forEach(r => {
                const v = r[phase]?.[qId];
                if (v !== undefined) { sum += v; count++; }
              });
              return count > 0 ? parseFloat((sum / count).toFixed(2)) : null;
            };

            const getGlobalAvg = (phase) => {
              let sum = 0, count = 0;
              responses.forEach(r => {
                QUESTIONS.forEach(q => {
                  const v = r[phase]?.[q.id];
                  if (v !== undefined) { sum += v; count++; }
                });
              });
              return count > 0 ? parseFloat((sum / count).toFixed(2)) : null;
            };

            const scoreColor = (val) => {
              if (val === null || val === undefined || val === '-') return '';
              const n = parseFloat(val);
              if (n >= 4.5) return 'text-emerald-600 dark:text-emerald-400 font-extrabold';
              if (n >= 3.5) return 'text-blue-600 dark:text-blue-400 font-bold';
              if (n >= 2.5) return 'text-amber-600 dark:text-amber-400 font-bold';
              return 'text-rose-600 dark:text-rose-400 font-bold';
            };

            return phases.map(phase => (
              <div key={phase.key} className="bg-card border border-border/80 rounded-3xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-base sm:text-lg font-bold text-text-main">
                    Tabla de Puntuaciones por Pregunta — <span className={phase.textColor}>{phase.label}</span>
                  </h2>
                </div>
                <p className="text-xs text-text-muted mb-4">
                  Puntuación Likert (1–5) de cada participante por pregunta. La fila <strong>PROMEDIO</strong> refleja la media del grupo piloto.
                </p>

                <div className="overflow-x-auto">
                  <table className="text-[10px] border-collapse min-w-max w-full">
                    <thead>
                      {/* Fila de dimensiones */}
                      <tr>
                        <th className="py-2 px-3 border border-border/60 bg-surface font-bold text-text-muted text-left" rowSpan={2}>PARTICIPANTE</th>
                        {['ChatGPT', 'Gemini', 'Copilot', 'Comprensión de contenidos', 'Creatividad'].map(dim => {
                          const count = QUESTIONS.filter(q => q.dimension === dim).length;
                          return (
                            <th
                              key={dim}
                              colSpan={count}
                              className={`py-1.5 px-2 border border-border/60 text-center font-extrabold uppercase tracking-wide ${phase.headerBg} ${phase.textColor}`}
                            >
                              {dim}
                            </th>
                          );
                        })}
                        <th className={`py-1.5 px-2 border border-border/60 text-center font-extrabold uppercase tracking-wide ${phase.headerBg} ${phase.textColor}`} rowSpan={2}>
                          PROM.
                        </th>
                      </tr>
                      {/* Fila de preguntas */}
                      <tr>
                        {QUESTIONS.map((q, i) => (
                          <th key={q.id} className="py-1.5 px-2 border border-border/60 bg-surface text-center font-bold text-text-muted whitespace-nowrap">
                            P{i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((r, idx) => {
                        const rowAvg = getParticipantQuestionAvg(r, phase.key);
                        return (
                          <tr key={r.id} className={`border-b border-border/30 ${idx % 2 === 0 ? 'bg-surface/20' : ''} hover:bg-primary/5 transition-colors`}>
                            <td className="py-1.5 px-3 border border-border/40 font-mono font-bold text-primary whitespace-nowrap">
                              {r.participantId || `P${idx + 1}`}
                            </td>
                            {QUESTIONS.map(q => {
                              const val = r[phase.key]?.[q.id];
                              return (
                                <td key={q.id} className={`py-1.5 px-2 border border-border/30 text-center ${scoreColor(val)}`}>
                                  {val !== undefined ? val : <span className="text-text-muted/40">—</span>}
                                </td>
                              );
                            })}
                            <td className={`py-1.5 px-2 border border-border/40 text-center font-extrabold ${phase.textColor}`}>
                              {rowAvg !== null ? rowAvg : '—'}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Fila PROMEDIO */}
                      <tr className={`${phase.headerBg} border-t-2 border-primary/30`}>
                        <td className={`py-2 px-3 border border-border/60 font-extrabold uppercase tracking-wider ${phase.textColor}`}>
                          PROMEDIO
                        </td>
                        {QUESTIONS.map(q => {
                          const avg = getColumnAvg(phase.key, q.id);
                          return (
                            <td key={q.id} className={`py-2 px-2 border border-border/40 text-center font-extrabold ${scoreColor(avg)}`}>
                              {avg !== null ? avg : '—'}
                            </td>
                          );
                        })}
                        <td className={`py-2 px-2 border border-border/40 text-center font-extrabold text-sm ${phase.textColor}`}>
                          {getGlobalAvg(phase.key) ?? '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Leyenda de colores */}
                <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-text-muted">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> 4.5–5.0 Destacado</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> 3.5–4.4 Logrado</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> 2.5–3.4 En desarrollo</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> 1.0–2.4 En inicio</span>
                </div>
              </div>
            ));
          })()}

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

            {/* Tabla de preguntas estilo Excel */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-text-main border-b border-border/60 pb-2">
                Puntuaciones Pretest vs. Posttest — todas las preguntas
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 border border-border/60 bg-surface font-bold text-text-muted text-left" rowSpan={2}>#</th>
                      <th className="py-2 px-3 border border-border/60 bg-surface font-bold text-text-muted text-left" rowSpan={2}>PREGUNTA</th>
                      <th className="py-2 px-3 border border-border/60 bg-surface font-bold text-text-muted text-left" rowSpan={2}>DIMENSIÓN</th>
                      <th className="py-1.5 px-2 border border-border/60 bg-slate-100 dark:bg-slate-800 text-center font-extrabold uppercase text-slate-700 dark:text-slate-200" colSpan={2}>FASES</th>
                    </tr>
                    <tr>
                      <th className="py-1.5 px-3 border border-border/60 bg-slate-100 dark:bg-slate-800 text-center font-extrabold text-slate-600 dark:text-slate-300 whitespace-nowrap">PRE</th>
                      <th className="py-1.5 px-3 border border-border/60 bg-primary/10 dark:bg-primary/20 text-center font-extrabold text-primary whitespace-nowrap">POST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUESTIONS.map((q, i) => {
                      const preVal = selectedResponse.pretest?.[q.id];
                      const postVal = selectedResponse.posttest?.[q.id];
                      const diff = (preVal !== undefined && postVal !== undefined) ? postVal - preVal : null;

                      const valColor = (val) => {
                        if (val === undefined) return 'text-text-muted/40';
                        if (val >= 5) return 'text-emerald-600 dark:text-emerald-400 font-extrabold';
                        if (val >= 4) return 'text-blue-600 dark:text-blue-400 font-bold';
                        if (val >= 3) return 'text-amber-600 dark:text-amber-400 font-bold';
                        return 'text-rose-600 dark:text-rose-400 font-bold';
                      };

                      return (
                        <tr key={q.id} className={`border-b border-border/30 ${i % 2 === 0 ? 'bg-surface/20' : ''} hover:bg-primary/5 transition-colors`}>
                          <td className="py-1.5 px-3 border border-border/40 font-bold text-text-muted text-center">{i + 1}</td>
                          <td className="py-1.5 px-3 border border-border/40 font-medium text-text-main max-w-[260px]">{q.text}</td>
                          <td className="py-1.5 px-3 border border-border/40 text-text-muted whitespace-nowrap">{q.dimension}</td>
                          <td className={`py-1.5 px-3 border border-border/30 text-center ${valColor(preVal)}`}>
                            {preVal !== undefined ? preVal : '—'}
                          </td>
                          <td className={`py-1.5 px-3 border border-border/30 text-center ${valColor(postVal)}`}>
                            {postVal !== undefined ? (
                              <span className="flex items-center justify-center gap-1">
                                {postVal}
                                {diff !== null && (
                                  <span className={`text-[9px] font-bold ${diff > 0 ? 'text-emerald-500' : diff < 0 ? 'text-rose-500' : 'text-text-muted'}`}>
                                    {diff > 0 ? `▲+${diff}` : diff < 0 ? `▼${diff}` : '='}
                                  </span>
                                )}
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Fila PROMEDIO */}
                    <tr className="bg-slate-100 dark:bg-slate-800/60 border-t-2 border-primary/30 font-extrabold">
                      <td colSpan={3} className="py-2 px-3 border border-border/60 text-text-muted uppercase tracking-wider text-right">
                        PROMEDIO
                      </td>
                      <td className="py-2 px-3 border border-border/40 text-center text-slate-700 dark:text-slate-200 font-extrabold">
                        {(() => {
                          const vals = QUESTIONS.map(q => selectedResponse.pretest?.[q.id]).filter(v => v !== undefined);
                          return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '—';
                        })()}
                      </td>
                      <td className="py-2 px-3 border border-border/40 text-center text-primary font-extrabold">
                        {(() => {
                          const vals = QUESTIONS.map(q => selectedResponse.posttest?.[q.id]).filter(v => v !== undefined);
                          return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '—';
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-text-muted italic">▲ = mejora · ▼ = descenso · = = sin cambio respecto al pretest</p>
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
      {/* Modal de Observaciones del Ítem */}
      {selectedItemObservations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            onClick={() => setSelectedItemObservations(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          <div className="relative bg-card border border-border rounded-3xl w-full max-w-lg p-6 shadow-xl z-10 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Observaciones de Expertos
                </span>
                <h3 className="text-base font-extrabold text-text-main mt-1">
                  Ítem {selectedItemObservations.itemNumber}: "{selectedItemObservations.itemText}"
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemObservations(null)}
                className="p-1 px-2.5 hover:bg-surface border border-border rounded-lg text-text-muted hover:text-text-main text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {selectedItemObservations.observations.map((obs, i) => {
                const separatorIdx = obs.indexOf(': ');
                const expertName = separatorIdx !== -1 ? obs.substring(0, separatorIdx) : 'Experto';
                const obsText = separatorIdx !== -1 ? obs.substring(separatorIdx + 2).replace(/"/g, '') : obs;

                return (
                  <div key={i} className="p-3 bg-surface rounded-xl border border-border/50 text-xs text-left">
                    <span className="font-extrabold text-text-main block mb-1">{expertName}</span>
                    <p className="text-text-muted italic leading-relaxed">"{obsText}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
