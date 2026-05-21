import { X, FolderPlus, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function FolderModal({ isOpen, onClose, onSubmit, initialFolder }) {
  const [name, setName] = useState('');

  const isEditing = !!initialFolder;

  useEffect(() => {
    if (isOpen) {
      setName(initialFolder ? initialFolder.name : '');
    }
  }, [isOpen, initialFolder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isEditing ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                    {isEditing
                      ? <Pencil className="w-5 h-5" />
                      : <FolderPlus className="w-5 h-5" />
                    }
                  </div>
                  <h2 className="text-xl font-bold text-text-main">
                    {isEditing ? 'Renombrar Carpeta' : 'Nueva Carpeta'}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface rounded-xl transition-colors text-text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">Nombre</label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Viajes, Trabajo, Hogar..."
                    className="w-full bg-surface border-none focus:ring-2 ring-primary/20 rounded-2xl p-4 text-text-main outline-none transition-all placeholder:text-text-muted/40"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-4 rounded-2xl font-bold text-text-main hover:bg-surface transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`flex-[2] text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 ${
                      isEditing
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                        : 'bg-primary hover:bg-primary-hover shadow-primary/20'
                    }`}
                  >
                    {isEditing ? 'Guardar cambios' : 'Crear Carpeta'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
