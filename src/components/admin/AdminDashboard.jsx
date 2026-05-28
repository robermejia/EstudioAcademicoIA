import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart3, Database, Download, LogOut, Search, 
  ChevronRight, Calendar, Info, RefreshCw, CheckCircle, GraduationCap
} from 'lucide-react';
import { getAllResponses } from '../../lib/surveyService';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

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
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null); // Detalle de un participante

  const fetchResponses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllResponses();
      // Ordenar por fecha descendente
      data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setResponses(data);
    } catch (err) {
      console.error(err);
      setError('Error al recuperar las respuestas de la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogoutSuccess();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Cálculo de estadísticas descriptivas generales
  const totalParticipants = responses.length;
  
  const averageAge = totalParticipants > 0 
    ? (responses.reduce((sum, r) => sum + (r.demographics?.age || 0), 0) / totalParticipants).toFixed(1)
    : 0;

  const aiExperiencePercent = totalParticipants > 0
    ? Math.round((responses.filter(r => r.demographics?.hasUsedAI === 'yes').length / totalParticipants) * 100)
    : 0;

  // Conteo de herramienta más usada
  const toolCounts = responses.reduce((acc, r) => {
    const tool = r.demographics?.mostUsedTool || 'Ninguna';
    acc[tool] = (acc[tool] || 0) + 1;
    return acc;
  }, {});

  const getToolPercent = (toolName) => {
    if (totalParticipants === 0) return 0;
    return Math.round(((toolCounts[toolName] || 0) / totalParticipants) * 100);
  };

  // Función para calcular promedio de dimensión (escala 1-5)
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

  // Filtrar respuestas de la tabla
  const filteredResponses = responses.filter(r => {
    const search = searchQuery.toLowerCase();
    const idMatch = (r.participantId || '').toLowerCase().includes(search);
    const genderMatch = (r.demographics?.gender || '').toLowerCase().includes(search);
    const toolMatch = (r.demographics?.mostUsedTool || '').toLowerCase().includes(search);
    return idMatch || genderMatch || toolMatch;
  });

  // Exportación a CSV
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

    // Añadir BOM de UTF-8 para compatibilidad de acentos en Excel
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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Barra de cabecera del Admin */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card border border-border/80 p-6 rounded-3xl shadow-sm">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-1">
            Panel de Control Académico
          </span>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Dashboard de Estadísticas
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button
            type="button"
            onClick={fetchResponses}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-surface hover:bg-surface-hover border border-border text-text-main text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
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
            Exportar CSV
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 text-center font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Participantes</span>
                <span className="text-2xl font-black text-text-main">{totalParticipants}</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Edad Promedio</span>
                <span className="text-2xl font-black text-text-main">{averageAge} años</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">Uso Previo de IA</span>
                <span className="text-2xl font-black text-text-main">{aiExperiencePercent}%</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block">ChatGPT Favorito</span>
                <span className="text-2xl font-black text-text-main">{getToolPercent('ChatGPT')}%</span>
              </div>
            </div>
          </div>

          {/* Gráfico Comparativo Pretest vs Posttest */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-text-main">
                Efectividad: Comparativa Pretest vs. Posttest
              </h2>
            </div>
            
            {totalParticipants === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">No hay respuestas registradas aún para generar estadísticas.</p>
            ) : (
              <div className="space-y-6">
                {DIMENSIONS.map((dim) => {
                  const preAvg = getDimensionAverage(dim.key, 'pretest');
                  const postAvg = getDimensionAverage(dim.key, 'posttest');
                  
                  // Escala de barra basada en el valor del promedio (máximo es 5.0)
                  const prePct = (preAvg / 5) * 100;
                  const postPct = (postAvg / 5) * 100;

                  return (
                    <div key={dim.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 pb-6 border-b border-border/55 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-bold text-text-main block">{dim.label}</span>
                        <span className="text-xs text-text-muted">Escala Likert (1 - 5)</span>
                      </div>
                      
                      {/* Barras de comparación */}
                      <div className="md:col-span-3 space-y-2.5">
                        {/* Pretest */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-text-muted">Pretest</span>
                            <span className="font-bold text-text-main">{preAvg} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/40">
                            <motion.div
                              className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${prePct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
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
                            <motion.div
                              className={`h-full ${dim.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${postPct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
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
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Registros de Participación
              </h2>
              
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
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
                <table className="w-full text-left text-xs border-collapse">
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
        </>
      )}

      {/* Modal de Detalles del Participante */}
      <AnimatePresence>
        {selectedResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResponse(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-xl z-10"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                    ID Registro: {selectedResponse.id}
                  </span>
                  <h3 className="text-xl font-bold text-text-main">
                    Participante: <span className="font-mono text-primary select-all">{selectedResponse.participantId}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="p-1 px-2.5 hover:bg-surface border border-border rounded-lg text-text-muted hover:text-text-main text-xs transition-colors cursor-pointer"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
