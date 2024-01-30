import {useState,useEffect} from 'react'
import delay from '@/functions/delay'

const TXConfirming = ({writing}) => {

    const [css0,setCss0] = useState("hidden")
    const [css1,setCss1] = useState("hidden")

    useEffect(() => {
        const closeModal = async() => {
            setCss0("animate__animated animate__fadeOut animate__faster")
            await delay(450)
            setCss1("hidden")
        }
        const openModal = async() => {
            setCss0("animate__animated animate__fadeIn animate__faster")
            setCss1("txWrapper")
        }
        writing ? openModal() : closeModal()
    }, [writing])

    return(
        <div className={`${css0} ${css1}`}>
            <div className={"txContainer"}><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><h1>Writing To<br/>Blockchain</h1></div>
        </div>
    )
}

export default TXConfirming