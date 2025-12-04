import { Button } from "@mui/joy";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import OllamaLogo from "../../assets/images/ollama.png";


interface InstallOllamaComponentProps{
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{
    success: boolean;
    message: string;
}, Error>>
}


export default function InstallOllamaComponent({refetch}:InstallOllamaComponentProps) {
  return(
    <div className="w-full h-full flex flex-col gap-10 relative items-center px-8 py-12">
      <div>
        <h1 className="text-slate-950 dark:text-[#faefe1] font-bold text-xl text-center">You don't have Ollama installed on your machine</h1>
        <h2 className="text-slate-950 dark:text-[#faefe1] text-center">To make Aurelius work, you need to install Ollama alongside with at least one LLM model available</h2>
      </div>

      <div className="flex flex-col justify-center items-center gap-5 mt-11">
        <div className="w-20 h-20 rounded-xl bg-white shadow-md flex justify-center items-center">
          <a href="https://ollama.com">
            <img src={OllamaLogo} alt="Ollama Logo" width={50} height={50} />
          </a>
        </div>
        <p className="text-slate-950 dark:text-[#faefe1]">
          Click the Ollama logo to install Ollama on their official website
        </p>
      </div>

      <div className="absolute bottom-16">
        <Button color="success" variant="solid" size="lg" onClick={()=> refetch()}>
          I have Ollama on my machine
        </Button>
      </div>
    </div>
  )
}