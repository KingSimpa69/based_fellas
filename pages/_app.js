import '@/styles/globals.css'
import 'animate.css';
import { useState } from 'react';
import { NavBar } from '@/components/NavBar'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Menu from '@/components/Menu';
const { library, config } = require('@fortawesome/fontawesome-svg-core');
import { faTwitter, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import WAGMI from '@/components/web3/WAGMI';
library.add(faTwitter,faGithub,faDiscord)
config.autoAddCss = false;


export default function App({ Component, pageProps }) {

  const [menu,toggleMenu] = useState(false);
  const [css0,setCss0] = useState("")
  const [css1,setCss1] = useState("")

  return (
  <div className={'app'}>
    <WAGMI>
      <Header/>
      <Menu menu={menu} toggleMenu={toggleMenu} setGlobalCSS0={setCss0} setGlobalCSS1={setCss1}/>
      <NavBar menu={menu} toggleMenu={toggleMenu} />
      <div className={`${css0} ${css1}`}>
      <Component {...pageProps} />
      <Footer />
      </div>
    </WAGMI>
  </div>
  )
}
