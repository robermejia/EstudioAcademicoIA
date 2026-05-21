import { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Folder, 
  Lightbulb, 
  User, 
  Settings, 
  Inbox, 
  ChevronRight, 
  ChevronLeft,
  Pencil,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ folders, activeFolderId, onSelectFolder, onNewIdea, onAddFolder, onSettingsOpen, onDropIdea, onRenameFolder, onDeleteFolder }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight text-text-main">
            IdeaManager
          </span>
        )}
      </div>

      {/* New Idea Button */}
      <div className="px-4 mb-6">
        <button
          onClick={onNewIdea}
          className={cn(
            "w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20",
            isCollapsed ? "p-3" : "px-4"
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>Nueva Idea</span>}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-4 py-2 opacity-40 text-xs font-bold uppercase tracking-wider">
          {!isCollapsed ? 'Carpetas' : <Inbox className="w-4 h-4 mx-auto" />}
        </div>

        {folders.map((folder) => (
          <div key={folder.id} className="relative group/folder">
            <button
              onClick={() => onSelectFolder(folder.id)}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.parentElement.classList.add('ring-2', 'ring-primary/40', 'rounded-lg');
              }}
              onDragLeave={(e) => {
                e.currentTarget.parentElement.classList.remove('ring-2', 'ring-primary/40', 'rounded-lg');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.parentElement.classList.remove('ring-2', 'ring-primary/40', 'rounded-lg');
                const ideaId = e.dataTransfer.getData('ideaId');
                if (ideaId) onDropIdea(ideaId, folder.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all pr-10",
                activeFolderId === folder.id
                  ? "bg-surface text-primary"
                  : "text-text-muted hover:bg-surface hover:text-text-main"
              )}
            >
              <Folder className={cn(
                "w-5 h-5 flex-shrink-0",
                activeFolderId === folder.id ? "text-primary" : "text-text-muted"
              )} />
              {!isCollapsed && (
                <span className="font-medium text-sm truncate flex-1 text-left">{folder.name}</span>
              )}
            </button>

            {/* Botón ⋯: visible en hover O cuando el menú está abierto */}
            {!isCollapsed && (
              <div className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity",
                openMenuId === folder.id ? "opacity-100" : "opacity-0 group-hover/folder:opacity-100"
              )}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === folder.id ? null : folder.id);
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all text-text-muted",
                    openMenuId === folder.id
                      ? "bg-surface text-text-main"
                      : "hover:bg-border hover:text-text-main"
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Dropdown: fuera del wrapper de opacidad para que no desaparezca al mover el mouse */}
            <AnimatePresence>
              {openMenuId === folder.id && !isCollapsed && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-2 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setOpenMenuId(null); onRenameFolder(folder); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-text-main hover:bg-surface transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                    Renombrar
                  </button>
                  <div className="h-px bg-border mx-3" />
                  <button
                    onClick={() => { setOpenMenuId(null); onDeleteFolder(folder.id); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <button
          onClick={onAddFolder}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:bg-surface hover:text-text-main transition-all group mt-4 border border-dashed border-border hover:border-primary",
            isCollapsed && "border-none"
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Nueva carpeta</span>}
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-1 mb-6">
          <button
            onClick={onSettingsOpen}
            className="flex items-center gap-3 w-full px-4 py-3 text-text-muted hover:text-text-main hover:bg-surface rounded-2xl transition-all font-bold text-sm"
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span>Configuración</span>}
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-text-muted hover:text-text-main hover:bg-surface rounded-2xl transition-all font-bold text-sm">
            <User className="w-5 h-5" />
            {!isCollapsed && <span>Ayuda</span>}
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-card border border-border p-1 rounded-full shadow-sm hover:bg-surface transition-all lg:flex hidden"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
