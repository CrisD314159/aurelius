import { motion } from 'framer-motion';
import { ModelInfo } from "../../lib/definitions"
import { Button, IconButton } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import ChooseModelButton from '../button/ChooseModelButton';

interface ModelSelectionComponent{
  stepUp: () => void
  stepDown: () => void
  setModel: (name:string) => void
  selectedModel: string
  models: string | ModelInfo[]
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{
    success: boolean;
    message: string | ModelInfo[];
}, Error>>
}

export default function ModelSelectionComponent({models, setModel, stepDown, stepUp, selectedModel, refetch}:ModelSelectionComponent) {
  
  return (
    <div className="w-full flex flex-col items-center mx-auto px-6 py-8 h-full">
      <motion.div
        className='w-full flex flex-col items-start'
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

      <div className=" flex flex-col items-center gap-4 mb-8 overflow-y-scroll w-full pb-8 pt-3">
        {(Array.isArray(models) && models.length > 0 ? models : []).map((model, index) => (
          <ChooseModelButton index={index} model={model} selectedModel={selectedModel} setModel={setModel}/>
        ))}
          {(Array.isArray(models) && models.length === 0 &&
            <div className='w-full h-full flex flex-col items-center'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-[#faefe1]'>
                You dont have any local model installed on your system</h2>

              <p className='text-gray-600 dark:text-gray-400 mb-8'>
                To use Aurelius properly, you need to install at least 1 LLM on your machine</p>

              <h3 className='text-gray-600 dark:text-[#faefe1] mb-8 text-lg'>To install a recommended local model, you can use the command below</h3>

              <div className='w-[50%] h-12 bg-slate-900 flex items-center justify-center rounded-md border mb-10'>
                <p className='font-mono text-[#faefe1] text-lg'>ollama run gemma3:1b</p>
              </div>

              <Button size='lg' color='success' variant='solid' onClick={()=> refetch()}>I have a model installed</Button>
            </div>
          )}
      
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