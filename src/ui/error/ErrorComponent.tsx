import { Button } from "@mui/joy";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ModelInfo } from "../../lib/definitions";

interface ErrorComponentProps {
  message?: string;
  title?: string;
  refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<{
    success: boolean;
    message: string | ModelInfo[];
}, Error>>
}

export default function ErrorComponent({ 
  message = "Something went wrong. Please try again.",
  title = "Oops!",
  refetch 
}: ErrorComponentProps) {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen p-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 dark:bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-800 to-green-900 dark:from-green-600 dark:to-green-700 rounded-full p-4">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>

          {
            refetch &&
            <Button
              onClick={()=> refetch()}
              color="success"
            >
              Try Again
            </Button>
          }


          
    </div>
  )
}