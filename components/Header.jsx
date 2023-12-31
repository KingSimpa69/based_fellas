import Head from "next/head"
import { useRouter } from 'next/router';

const Header = () => {

  const router = useRouter()
  const pathRegex = /\/([^\/]+)\//;

    return (
          <Head>
            <title>
              {`Based Fellas - ${router.pathname === "/" ? "A 10k Generative PFP NFT Art Collection on Base Layer 2" :
              router.pathname.match(pathRegex) ? router.pathname.match(pathRegex)[1].slice(0,1).toUpperCase() + router.pathname.match(pathRegex)[1].slice(1) :
              router.route.slice(1,2).toUpperCase() + router.route.slice(2)}`}
            </title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="theme-color" content="#ffffff"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Explore Based Fellas, a 10,000-piece generative PFP NFT art collection that launched on Ethereum's Layer 2, Base. Join our community and be part of the exciting journey in the world of Web3." />

          </Head>
      )
}

export default Header