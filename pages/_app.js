import '@/styles/globals.css'
import 'animate.css';
import { useState } from 'react';
import { NavBar } from '@/components/NavBar'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Menu from '@/components/Menu';
const { library, config } = require('@fortawesome/fontawesome-svg-core');
import { faTwitter, faGithub, faDiscord, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import WAGMI from '@/components/web3/WAGMI';
import Alert from '@/components/Alert';
import { useWindowSize } from "@/hooks/useWindowSize";
library.add(faTwitter,faGithub,faDiscord,faLinkedin)
config.autoAddCss = false;


export default function App({ Component, pageProps }) {

  const windowSize = useWindowSize()
  const [menu,toggleMenu] = useState(false);
  const [css0,setCss0] = useState("")
  const [css1,setCss1] = useState("")
  const [alerts,setAlerts] = useState([])

  const alert = (type,message) => {
    setAlerts(alerts=>[...alerts,{
      type:type,
      message:message
    }])
  }

  return (
  <div className={'app'}>
    <WAGMI>
      <Header/>
      <Alert alerts={alerts} setAlerts={setAlerts} />
      <Menu menu={menu} toggleMenu={toggleMenu} setGlobalCSS0={setCss0} setGlobalCSS1={setCss1}/>
      <NavBar menu={menu} toggleMenu={toggleMenu} />
      <div className={`${css0} ${css1}`}>
      <Component alert={alert} windowSize={windowSize} {...pageProps} />
      <Footer />
      </div>
    </WAGMI>
  </div>
  )
}
