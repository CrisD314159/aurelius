import { motion } from 'framer-motion';
import { ModelInfo } from "../../lib/definitions"
import { IconButton } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ModelSelectionComponent{
  stepUp: () => void
  stepDown: () => void
  setModel: (name:string) => void
  selectedModel: string
  models: string | ModelInfo[]
}

export default function ModelSelectionComponent({models, setModel, stepDown, stepUp, selectedModel}:ModelSelectionComponent) {
  
  return (
    <div className="w-full mx-auto px-6 py-8 h-full relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[#faefe1]">
          Select a model of your preference
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Choose the AI model that best fits your needs
        </p>
      </motion.div>

      <div className="grid gap-4 mb-8">
        {(Array.isArray(models) ? models : []).map((model, index) => (
          <motion.button
            key={model.model}
            onClick={() => setModel(model.model)}
            className={`relative w-full p-6 rounded-2xl border-2 text-left overflow-hidden transition-all ${
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
        ))}
      </div>

      <div className="flex w-full justify-around absolute bottom-10">
        <IconButton
          size='lg'
          color='success'
          variant='solid'

          onClick={stepDown}
        >
          <ArrowBackIcon/>
        </IconButton>

        <IconButton
          size='lg'
          color='success'
          variant='solid'
          disabled={!selectedModel}
          onClick={stepUp}
        >
          <ArrowForwardIcon/>
        </IconButton>
      </div>
    </div>
  )
}