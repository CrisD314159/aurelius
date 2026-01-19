import {motion} from 'framer-motion'
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserConfig, updateUser } from '../../lib/http/http_queries';
import toast from 'react-hot-toast';
import { Button, FormControl, IconButton, Input } from '@mui/joy';
import ChooseModelButton from '../buttons/ChooseModelButton';
import { RegisterUserInterface } from '../../lib/definitions';
import LoadingComponent from '../loading/LoadingComponent';



interface ChangeConfigModalFormProps{
  open: boolean
  setOpen: (value:boolean) => void

}

export default function ChangeConfigModalForm({open, setOpen}:ChangeConfigModalFormProps) {
  const [selectedModel, setSelectedModel] = useState('')
  const [userName, setUserName] = useState('')
  const [error, setError] = useState(false)
  const {isPending: isPendingQuery, isSuccess: isSuccessQuery, isError, data} = useQuery({queryKey:['userConfig'], queryFn:getUserConfig})

    const {isPending, isSuccess, mutate} = useMutation({
      mutationFn: updateUser,
      onError: (e) =>{
        toast.error(e.message)
      }
    })

  useEffect(()=>{
    if(isSuccess){
      toast.success("Changes Saved")
      setOpen(false)
    }
  }, [isSuccess, setOpen])

  useEffect(()=>{
    if(isSuccessQuery && Array.isArray(data.message.user_data) && data.message.user_data.length > 0){
      setSelectedModel(data.message.user_data[1])
      setUserName(data.message.user_data[0])
    }
  }, [data, isSuccessQuery])

  const handleSubmit = () => {
    if(userName.length < 3){
      setError(true)
      return
    }

    const values: RegisterUserInterface = {user_name: userName, model: selectedModel}
    mutate(values)
  }

  if(isError){
    toast.error("An error occured while fetching user data")
    setOpen(false)
  }

  return (
  <motion.div className={`fixed inset-0 z-40 w-screen h-screen flex justify-center items-center`}
        onClick={()=> setOpen(false)}>
      <motion.div 
                initial={{opacity:0, ascent:0}} 
                animate={{opacity: 1, ascent:1}}
                exit={{opacity:1, ascent:0}} 
                className='z-50 w-[90%] max-w-2xl h-auto max-h-[80vh] rounded-2xl p-8 bg-[#faefe1]/95 dark:bg-zinc-950/95 shadow-2xl border overflow-y-auto'
                style={{backdropFilter:'blur'}}
                onClick={(e) => e.stopPropagation()}
              >
      
                {isPendingQuery && <LoadingComponent/>}
      
                {isSuccessQuery && 
                  <div
                    className='flex flex-col gap-6 h-full w-full'
                  >
                    <div className='space-y-2'>
                      <h1 className='text-2xl font-bold text-zinc-800 dark:text-zinc-100'>Settings</h1>
                      <p className='text-sm text-zinc-600 dark:text-zinc-400'>Update your configuration</p>
                    </div>
      
                    <FormControl className='space-y-2'>
                      <h1 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                        Name
                      </h1>
                      <Input 
                        autoFocus 
                        error={error}
                        onChange={(e)=>{
                          setUserName(e.target.value)
                        }}
                        required 
                        defaultValue={userName}
                        className='transition-all'
                        sx={{
                          '--Input-focusedThickness': '2px',
                        }}
                      />
                      {error &&
                        <span className='text-sm text-red-600'>
                          Your name must be at least 3 characters long</span>
                      }
                    </FormControl>
      
                    <FormControl className='space-y-2'>
                      <h1 className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                        Model Selection
                      </h1>
                      <div className='w-full max-h-48 flex flex-col items-center gap-5 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 p-2 space-y-2'>
                        {
                          (data.message.available_models.length > 0 ?
                          data.message.available_models : []
                          ).map((model, index) =>
                          <ChooseModelButton
                            key={index}
                            index={index} 
                            model={model} 
                            selectedModel={selectedModel} 
                            setModel={setSelectedModel}
                          />
                          )
                        }
                      </div>
                    </FormControl>
      
                    <div className='flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800'>
                      <Button 
                        variant="solid" 
                        color="danger"
                        onClick={() => setOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant='solid'
                        color='success'
                        className='min-w-24'
                        onClick={()=> handleSubmit()}
                        loading={isPending}
                      >
                        Save Changes
                      </Button>
                    </div>
                          
                  </div>
                }
      
      
        </motion.div>
    </motion.div>
  )
}