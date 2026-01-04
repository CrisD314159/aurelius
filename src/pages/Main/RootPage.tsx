import { Outlet } from "react-router";
import { useBackendHealth } from "../../lib/hooks/health_hook";
import LoadingComponent from "../../ui/loading/LoadingComponent";
import ErrorComponent from "../../ui/error/ErrorComponent";

export default function RootPage() {
  const {isChecking, error } = useBackendHealth();

  if (isChecking) {
    return (
      <div className="w-full h-full bg-[#faefe1] dark:bg-neutral-800 ">
        <LoadingComponent/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-[#faefe1] dark:bg-neutral-800 ">
        <ErrorComponent 
          message={error}
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-[#faefe1] dark:bg-neutral-800 ">
      <Outlet/>
    </div>
)
}