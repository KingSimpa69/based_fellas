import style from "@/styles/alert.module.css"
import { useEffect } from "react"


const Alert = ({ alerts, setAlerts }) => {

    useEffect(() => {
      let isMounted = true;
  
      if (isMounted && alerts.length > 0) {
        const alertsUpdate = [...alerts];
        alertsUpdate.shift();
  
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            setAlerts(alertsUpdate);
          }
        }, 3500);
  
        return () => {
          clearTimeout(timeoutId);
          isMounted = false;
        };
      }
  
      return () => {
        isMounted = false;
      };
    }, [alerts, setAlerts]);

    return (
        <div className={style.wrapper}>
            {alerts.map((e,index)=>{
                return(
                <div key={index} className={`${style.container} ${style[e.type]}`}>
                    <h1>{e.message}</h1>
                </div>
                )
            })}
        </div>
    )

  };
  
export default Alert