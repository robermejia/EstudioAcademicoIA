import { useState } from 'react';
import { ClipboardList, ArrowRight, ArrowLeft } from 'lucide-react';

export function ExpertDemographics({ onSave, onBack, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      profession: ''
    }
  );
  
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Por favor, ingrese su nombre.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Por favor, ingrese sus apellidos.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, ingrese su correo electrónico.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, ingrese un correo electrónico válido.';
    }
    if (!formData.profession.trim()) {
      newErrors.profession = 'Por favor, ingrese su profesión o especialidad.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Pack firstName and lastName into a single name parameter for backward compatibility
      onSave({
        ...formData,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`
      });
    }
  };

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm card-shadow">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              Datos del Experto Evaluador
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Por favor, proporcione sus datos de identificación para el registro de la validez del instrumento.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-semibold text-text-main">
                Nombre *
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Ej. Carlos"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                  errors.firstName ? 'border-red-400 focus:ring-red-400' : 'border-border'
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Apellidos */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-semibold text-text-main">
                Apellidos *
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Ej. Mendoza Silva"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                  errors.lastName ? 'border-red-400 focus:ring-red-400' : 'border-border'
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-text-main">
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ej. carlos.mendoza@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>
            )}
          </div>

          {/* Profesión */}
          <div className="space-y-2">
            <label htmlFor="profession" className="block text-sm font-semibold text-text-main">
              Profesión / Especialidad *
            </label>
            <input
              id="profession"
              type="text"
              placeholder="Ej. Doctor en Educación y Tecnología / Diseñador Instruccional"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-surface text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                errors.profession ? 'border-red-400 focus:ring-red-400' : 'border-border'
              }`}
            />
            {errors.profession && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.profession}</p>
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
              className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-sm hover:shadow cursor-pointer"
            >
              Iniciar Evaluación
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
