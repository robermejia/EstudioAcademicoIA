import { motion } from 'framer-motion';
import { ThumbsDown, AlertCircle, HelpCircle, ThumbsUp, Heart } from 'lucide-react';

const SCALE_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo', icon: ThumbsDown, color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 focus:ring-red-400', activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 2, label: 'En desacuerdo', icon: AlertCircle, color: 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 border-orange-200 focus:ring-orange-400', activeClass: 'bg-orange-500 text-white border-orange-500' },
  { value: 3, label: 'Neutral', icon: HelpCircle, color: 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/40 border-gray-200 focus:ring-gray-400', activeClass: 'bg-gray-500 text-white border-gray-500' },
  { value: 4, label: 'De acuerdo', icon: ThumbsUp, color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 focus:ring-blue-400', activeClass: 'bg-blue-500 text-white border-blue-500' },
  { value: 5, label: 'Totalmente de acuerdo', icon: Heart, color: 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-200 focus:ring-emerald-400', activeClass: 'bg-emerald-500 text-white border-emerald-500' }
];

export function LikertCard({ question, selectedValue, onChange }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm card-shadow"
    >
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300 mb-3">
          Dimensión: {question.dimension}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-text-main leading-snug">
          {question.text}
        </h3>
      </div>

      {/* Grid para opciones (Mobile/Tablet: vertical, Desktop: horizontal) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4 mt-6">
        {SCALE_OPTIONS.map((option) => {
          const isSelected = selectedValue === option.value;
          const OptionIcon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex lg:flex-col items-center justify-start lg:justify-center p-3.5 lg:p-4 rounded-2xl border text-left lg:text-center transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 ${
                isSelected
                  ? option.activeClass + ' scale-[1.02] shadow-md shadow-black/5 dark:shadow-none'
                  : 'bg-surface border-border hover:border-text-muted/40 ' + option.color
              }`}
            >
              <div className={`p-2.5 rounded-full lg:mb-3 mr-4 lg:mr-0 transition-colors ${
                isSelected ? 'bg-white/20 text-white' : 'bg-card'
              }`}>
                <OptionIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col lg:items-center">
                <span className={`text-lg font-bold lg:hidden ${isSelected ? 'text-white' : 'text-text-main'}`}>
                  {option.value}
                </span>
                <span className={`text-xs lg:text-sm font-semibold tracking-wide ${
                  isSelected ? 'text-white' : 'text-text-muted dark:text-slate-300'
                }`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
