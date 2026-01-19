import { motion } from 'framer-motion';
import { ModelInfo } from '../../lib/definitions';


interface ChooseModelButtonProps{
  model: ModelInfo
  setModel: (model:string) => void
  selectedModel: string
  index: number
}

export default function ChooseModelButton({model, selectedModel, setModel, index}:ChooseModelButtonProps) {
  return (
    <motion.button
            key={model.model}
            onClick={() => setModel(model.model)}
            className={`w-[95%] p-6 rounded-2xl border-2 text-left transition-all h-[100px] ${
              selectedModel === model.model
                ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-700 shadow-lg shadow-green-500/40'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.1
            }}
          > 
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${
                  selectedModel === model.model 
                    ? 'text-white' 
                    : 'text-green-900 dark:text-green-100'
                }`}>
                  {model.model}
                </h3>
                <p className={`text-sm ${
                  selectedModel === model.model 
                    ? 'text-green-50' 
                    : 'text-green-700 dark:text-green-300'
                }`}>
                  {model.details.parameter_size || 'AI language model'}
                </p>
              </div>
            </div>
          </motion.button>
  )
  
}