import { Step, StepIndicator, Stepper } from "@mui/joy"
import { ModelInfo } from "../../lib/definitions"
import { useState } from "react";
import { Check } from "@mui/icons-material";
import NameStepComponent from "../setupSteps/NameStepComponent";
import ModelSelectionComponent from "../setupSteps/ModelSelectionComponent";
import SetupCompleteComponent from "../setupSteps/SetupCompleteComponent";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../lib/http/http_queries";
import toast from "react-hot-toast";
import LoadingComponent from "../loading/LoadingComponent";

interface SetupFormComponentProps{
  models: string | ModelInfo[]
}

export default function SetupFormComponent({models}:SetupFormComponentProps) {
  console.log(models);
  const steps = ["What's your name?", "Select your favorite model", "You're all set"]
  const [stepPosition, setStepPosition]= useState(0)
  const [userName, setUserName]= useState('')
  const [modelSelected, setModelSelected]= useState('')

  const {isPending, isSuccess, mutate} = useMutation({
    mutationFn:registerUser,
    onError: (e) =>{
      toast.error(e.message)
    }
  })

  const handleStepPositionUp = () =>{
    setStepPosition(stepPosition+1)
  }
  const handleStepPositionDown = () =>{
    setStepPosition(stepPosition-1)
  }

  const handleSubmit = () =>{
    setStepPosition(2)
    mutate({model: modelSelected, user_name: userName})
  }

  if(isPending){
    return <LoadingComponent/>
  }

  return (
    <div className="w-full h-full px-8 py-10">
      <Stepper size="lg">
        {steps.map((value, index)=>{
          return (
            <Step
              key={index}
              indicator={
                <StepIndicator
                  variant={stepPosition >= (index) ? "solid" : "soft"}
                  color="success"
                  
                >
                  {stepPosition > index ?  <Check/> : (index + 1) }
                </StepIndicator>
              }
            >
              <p className="text-slate-950 dark:text-[#faefe1]">{value}</p>
            </Step>
          )

        })}
        
      </Stepper>


    {
      stepPosition === 0 && 
        <NameStepComponent 
          name={userName} 
          setName={setUserName} 
          stepUp={handleStepPositionUp}/>

    }
    {
      stepPosition === 1 && 
        <ModelSelectionComponent 
          models={models} 
          setModel={setModelSelected} 
          selectedModel={modelSelected}
          stepDown={handleStepPositionDown}
          stepUp={handleSubmit}/>

    }
    {
      stepPosition === 2 && isSuccess &&
        <SetupCompleteComponent
        />

    }

    </div>
  )
}