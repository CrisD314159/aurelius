import { useEffect } from "react"
import { GeneralResponse } from "../../lib/definitions"
import { useNavigate } from "react-router";

interface RedirectComponentProps{
  data: GeneralResponse

}
export default function RedirectComponent({data}:RedirectComponentProps) {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (data.success) {
      navigate("/call");
    } else {
      navigate("/setup");
    }
  }, [data, navigate]);

  return <></>
}