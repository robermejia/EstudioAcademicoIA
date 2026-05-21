import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Tag, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function IdeaCard({ idea, folderName, onToggleComplete, onEdit, onDelete, onDragStart }) {
  const tags = Array.isArray(idea?.tags) ? idea.tags : [];
  const createdAt = idea?.createdAt ? new Date(idea.createdAt) : new Date();

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => {
        if (onDragStart) onDragStart();
        e.dataTransfer.setData('ideaId', idea.id);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group bg-card p-6 rounded-2xl border border-border card-shadow card-shadow-hover transition-all duration-300 relative",
        idea.completed && "opacity-75 bg-surface/50"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <button
          onClick={() => onToggleComplete(idea.id)}
          className={cn(
            "p-1 rounded-lg transition-colors mt-1",
            idea.completed ? "text-primary" : "text-text-muted hover:text-primary"
          )}
        >
          {idea.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        {/* Icono de la idea */}
        {idea.icon && (
          <div className="text-2xl flex-shrink-0 mt-0.5" title="Icono">
            {idea.icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-bold text-lg text-text-main line-clamp-1 group-hover:text-primary transition-colors italic transition-all",
            idea.completed && "line-through text-text-muted no-italic"
          )}>
            {idea.title}
          </h3>
          <p className={cn(
            "text-sm text-text-muted line-clamp-2 mt-1 leading-relaxed",
            idea.completed && "opacity-60"
          )}>
            {idea.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <span 
            key={tag} 
            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface">
            <Folder className="w-3.5 h-3.5" />
            <span>{folderName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(idea)}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(idea.id)}
            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {idea.completed && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-primary/10 text-primary p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
           </div>
        </div>
      )}
    </motion.div>
  );
}
