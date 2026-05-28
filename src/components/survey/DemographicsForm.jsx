import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ClipboardList, ArrowRight, ArrowLeft } from 'lucide-react';

export function DemographicsForm({ onSave, onBack, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      age: '',
      gender: '',
      hasUsedAI: '',
      mostUsedTool: ''
    }
  );
  
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      
      // Auto-seleccionar 'Ninguna' si dice que no ha usado herramientas de IA
      if (field === 'hasUsedAI') {
        if (value === 'no') {
          next.mostUsedTool = 'Ninguna';
        } else if (value === 'yes' && prev.mostUsedTool === 'Ninguna') {
          next.mostUsedTool = '';
        }
      }
      return next;
    });
    
    // Limpiar error al modificar el campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    // Si cambia de IA y se limpia el error de mostUsedTool
    if (field === 'hasUsedAI' && errors.mostUsedTool) {
      setErrors(prev => ({ ...prev, mostUsedTool: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.age) {
      newErrors.age = 'Por favor, ingrese su edad.';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'Ingrese una edad válida (18 a 100 años).';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Por favor, seleccione su sexo.';
    }

    if (!formData.hasUsedAI) {
      newErrors.hasUsedAI = 'Por favor, responda si ha utilizado IA anteriormente.';
    }

    if (!formData.mostUsedTool) {
      newErrors.mostUsedTool = 'Por favor, seleccione la herramienta que más utiliza.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        age: parseInt(formData.age, 10)
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm card-shadow"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              Datos Generales
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Esta información servirá únicamente para la segmentación del análisis de datos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Edad */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-semibold text-text-main">
              1. Edad *
            </label>
            <input
              id="age"
              type="number"
              min="18"
              max="100"
              placeholder="Ej. 25"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                errors.age ? 'border-red-400 focus:ring-red-400' : 'border-border'
              }`}
            />
            {errors.age && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.age}</p>
            )}
          </div>

          {/* Sexo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main">
              2. Sexo *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['Masculino', 'Femenino', 'Otro'].map((genderOption) => (
                <button
                  key={genderOption}
                  type="button"
                  onClick={() => handleChange('gender', genderOption)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    formData.gender === genderOption
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-surface border-border hover:border-text-muted/40 text-text-main'
                  }`}
                >
                  {genderOption}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.gender}</p>
            )}
          </div>

          {/* ¿Ha utilizado herramientas de IA anteriormente? */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main">
              3. ¿Ha utilizado herramientas de IA anteriormente? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Sí, las he utilizado', value: 'yes' },
                { label: 'No, nunca las he utilizado', value: 'no' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('hasUsedAI', option.value)}
                  className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    formData.hasUsedAI === option.value
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-surface border-border hover:border-text-muted/40 text-text-main'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.hasUsedAI && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.hasUsedAI}</p>
            )}
          </div>

          {/* ¿Qué herramienta utiliza con mayor frecuencia? */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main">
              4. ¿Qué herramienta utiliza con mayor frecuencia? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'ChatGPT', value: 'ChatGPT', disabled: formData.hasUsedAI === 'no' },
                { label: 'Gemini', value: 'Gemini', disabled: formData.hasUsedAI === 'no' },
                { label: 'Copilot', value: 'Copilot', disabled: formData.hasUsedAI === 'no' },
                { label: 'Ninguna', value: 'Ninguna', disabled: false }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleChange('mostUsedTool', option.value)}
                  className={`py-3.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    option.disabled 
                      ? 'opacity-40 cursor-not-allowed bg-border/20 border-border text-text-muted'
                      : formData.mostUsedTool === option.value
                        ? 'bg-primary border-primary text-white shadow-sm cursor-pointer'
                        : 'bg-surface border-border hover:border-text-muted/40 text-text-main cursor-pointer'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.mostUsedTool && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.mostUsedTool}</p>
            )}
          </div>

          {/* Botones de Navegación */}
          <div className="flex justify-between items-center pt-6 border-t border-border/60">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-5 py-3 hover:bg-surface rounded-xl border border-border text-text-main font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              Iniciar Pretest
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
