import { X, Plus, Tag as TagIcon, Folder, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Catálogo amplio de iconos como emojis por categorías
const ICON_CATEGORIES = [
  {
    label: '💡 Ideas & Creatividad',
    icons: ['💡', '🚀', '✨', '🎯', '🔥', '⚡', '🌟', '🎨', '🖌️', '🎭', '🎬', '📸', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧']
  },
  {
    label: '💼 Trabajo & Proyectos',
    icons: ['💼', '📋', '📊', '📈', '📉', '🗂️', '📁', '🗃️', '📌', '📍', '🔖', '✅', '☑️', '📝', '✍️', '🖊️', '🖋️', '📎', '🔗', '📐']
  },
  {
    label: '🧠 Aprendizaje & Ciencia',
    icons: ['🧠', '📚', '🎓', '🔬', '🔭', '🧪', '🧬', '⚗️', '🔮', '💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '📡', '🛰️', '🤖', '🧩', '🗺️']
  },
  {
    label: '🏃 Salud & Deporte',
    icons: ['🏃', '💪', '🧘', '🏋️', '⚽', '🏀', '🎾', '🏊', '🚴', '🧗', '🏔️', '🌿', '🍏', '🥗', '💊', '🩺', '❤️', '🫀', '🧬', '🦋']
  },
  {
    label: '🏠 Hogar & Vida',
    icons: ['🏠', '🏡', '🌱', '🌿', '🌺', '🌸', '🍀', '🌻', '🌙', '☀️', '🌈', '⭐', '🎁', '🎉', '🎊', '🍕', '🍔', '☕', '🍷', '🛒']
  },
  {
    label: '✈️ Viajes & Aventura',
    icons: ['✈️', '🌍', '🗺️', '🏖️', '🏝️', '⛰️', '🗼', '🏰', '🎡', '🚗', '🚢', '🚁', '🛻', '🏕️', '🌅', '🌄', '🌊', '🏜️', '🌋', '🗿']
  },
  {
    label: '💬 Social & Comunicación',
    icons: ['💬', '💭', '📣', '📢', '🤝', '👥', '👤', '💌', '📩', '📨', '📬', '📮', '🗣️', '👋', '🙌', '✊', '👍', '❤️', '🤗', '😊']
  },
  {
    label: '🔧 Tecnología & Herramientas',
    icons: ['🔧', '🔩', '⚙️', '🛠️', '🔨', '🪛', '🔑', '🗝️', '🔐', '🔒', '💡', '🔋', '🪫', '📻', '📺', '📷', '🎮', '🕹️', '🖨️', '⌚']
  },
  {
    label: '💰 Finanzas & Negocios',
    icons: ['💰', '💵', '💴', '💶', '💷', '💳', '🪙', '📊', '📈', '💹', '🏦', '🏧', '💸', '🤑', '💎', '🏆', '🥇', '🎖️', '👑', '🌐']
  },
  {
    label: '🎲 Juegos & Entretenimiento',
    icons: ['🎲', '🃏', '♟️', '🎯', '🎳', '🎮', '🕹️', '🧸', '🪁', '🎪', '🎠', '🎢', '🎡', '🎭', '🎬', '🍿', '🎞️', '📽️', '🎟️', '🎫']
  }
];

const ALL_ICONS = ICON_CATEGORIES.flatMap(c => c.icons);

export function IdeaModal({ isOpen, onClose, folders, activeFolderId, initialIdea, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [icon, setIcon] = useState('💡');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [iconSearch, setIconSearch] = useState('');

  useEffect(() => {
    if (initialIdea) {
      setTitle(initialIdea.title);
      setDescription(initialIdea.description);
      setFolderId(initialIdea.folderId);
      setTags(initialIdea.tags || []);
      setIcon(initialIdea.icon || '💡');
    } else {
      setTitle('');
      setDescription('');
      setFolderId(activeFolderId || folders[0]?.id || '');
      setTags([]);
      setIcon('💡');
    }
    setShowIconPicker(false);
    setIconSearch('');
  }, [initialIdea, isOpen, folders, activeFolderId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onSave({ title, description, folderId, tags, icon });
    onClose();
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const filteredIcons = iconSearch
    ? ALL_ICONS.filter((_, i) => i % 3 === 0).slice(0, 60) // cuando busca mostramos selección
    : ICON_CATEGORIES[activeCategory].icons;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { onClose(); setShowIconPicker(false); }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-main">
                  {initialIdea ? 'Editar Idea' : 'Nueva Idea'}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-surface rounded-xl transition-colors text-text-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Icono + Título en una fila */}
                <div className="flex gap-3 items-end">
                  {/* Selector de icono */}
                  <div className="space-y-2 flex-shrink-0">
                    <label className="text-sm font-bold text-text-main flex items-center gap-2">
                      <Smile className="w-4 h-4" /> Icono
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className="w-16 h-14 bg-surface rounded-2xl text-3xl flex items-center justify-center hover:bg-primary/10 hover:ring-2 ring-primary/30 transition-all"
                        title="Seleccionar icono"
                      >
                        {icon}
                      </button>

                      {/* Icon Picker Dropdown */}
                      <AnimatePresence>
                        {showIconPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 top-full mt-2 w-72 bg-card rounded-2xl shadow-2xl border border-border z-10 overflow-hidden"
                            onClick={e => e.stopPropagation()}
                          >
                            {/* Buscador */}
                            <div className="p-3 border-b border-border">
                              <input
                                type="text"
                                value={iconSearch}
                                onChange={e => setIconSearch(e.target.value)}
                                placeholder="Buscar icono..."
                                className="w-full bg-surface rounded-xl px-3 py-2 text-sm text-text-main outline-none placeholder:text-text-muted/50"
                              />
                            </div>

                            {/* Categorías - solo si no hay búsqueda */}
                            {!iconSearch && (
                              <div className="flex overflow-x-auto gap-1 p-2 border-b border-border scrollbar-hide">
                                {ICON_CATEGORIES.map((cat, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveCategory(i)}
                                    className={cn(
                                      "flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg transition-all whitespace-nowrap",
                                      activeCategory === i
                                        ? "bg-primary text-white"
                                        : "text-text-muted hover:bg-surface"
                                    )}
                                  >
                                    {cat.label.split(' ')[0]}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Grid de iconos */}
                            <div className="p-3 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                              {(iconSearch
                                ? ALL_ICONS.filter((_, i) => i % 2 === 0).slice(0, 56)
                                : ICON_CATEGORIES[activeCategory].icons
                              ).map((em, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => { setIcon(em); setShowIconPicker(false); setIconSearch(''); }}
                                  className={cn(
                                    "w-8 h-8 rounded-lg text-xl flex items-center justify-center transition-all hover:bg-primary/10 hover:scale-110",
                                    icon === em && "bg-primary/20 ring-2 ring-primary/40"
                                  )}
                                  title={em}
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Título */}
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-bold text-text-main">Título</label>
                    <input
                      autoFocus
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="¿En qué estás pensando?"
                      className="w-full bg-surface border-none focus:ring-2 ring-primary/20 rounded-2xl p-4 text-text-main outline-none transition-all placeholder:text-text-muted/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">Descripción</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuéntame más sobre esta idea..."
                    className="w-full bg-surface border-none focus:ring-2 ring-primary/20 rounded-2xl p-4 text-text-main outline-none transition-all resize-none placeholder:text-text-muted/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main flex items-center gap-2">
                      <Folder className="w-4 h-4" /> Carpeta
                    </label>
                    <select
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      className="w-full bg-surface border-none focus:ring-2 ring-primary/20 rounded-2xl p-4 text-text-main outline-none transition-all appearance-none"
                    >
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main flex items-center gap-2">
                      <TagIcon className="w-4 h-4" /> Etiquetas
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Presiona Enter..."
                        className="w-full bg-surface border-none focus:ring-2 ring-primary/20 rounded-2xl p-4 text-text-main outline-none transition-all placeholder:text-text-muted/40 pr-10"
                      />
                      <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-4 rounded-2xl font-bold text-text-main hover:bg-surface transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20"
                  >
                    {initialIdea ? 'Guardar Cambios' : 'Crear Idea'}
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
