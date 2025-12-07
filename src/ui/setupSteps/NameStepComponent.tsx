import {IconButton, Input } from "@mui/joy"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {motion} from 'framer-motion'

interface NameStepComponentProps{
  stepUp: () => void
  setName: (name:string) => void
  name: string
}

export default function NameStepComponent({name, setName, stepUp}: NameStepComponentProps) {
  const [error, setError] = useState(false)
  const [errorDetail, setErrorDetail] = useState('')

  useEffect(()=>{
    if(error){
      toast.error(errorDetail)
    }
  }, [error, errorDetail])
  
  return (
 
      <form action="" className="w-full h-full flex flex-col items-center relative">
        <motion.div
         className="w-full flex flex-col items-start mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#faefe1] mb-2">
              Enter your name below
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Aurelius will call you by this name
            </p>
        </motion.div>

          <Input 
            color="success" 
            variant="solid" 
            size="lg"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            placeholder="Introduce your name here"
            sx={{width:'50%', marginTop:'40px'}}
            required
            error = {error}
            type="text"
          />

        <div className="absolute bottom-10 ">
          <IconButton onClick={
            () =>{
              console.log(name.length);
              if(name.length < 3 || name === ''){
                setError(true)
                setErrorDetail('Name cannot be empty and should have at least 3 characters')
              }else{
                stepUp()
              }
            }
          } variant="solid" color="success" size="lg" type="submit">
            <ArrowForwardIcon/>
          </IconButton>
        </div>
      </form>
  )
}