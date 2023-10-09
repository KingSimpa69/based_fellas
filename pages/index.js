import dynamic from "next/dynamic";
import {useState,useEffect} from "react"
import {generateRandomImageURLs} from "@/functions/generateRandomImageURLs";
import styles from "@/styles/index.module.css"
import Intro from "@/components/index/Intro";
import WhoWeAre from "@/components/index/WhoWeAre";
import HorizontalRule from "@/components/HorizontalRule";

const FellaStrip = dynamic(
  () => import('@/components/index/FellaStrip'),
  { ssr: false }
)

export default function Home() {

  const randomImageURLs = generateRandomImageURLs(9999);
  const [randomImages, setRandomImages] = useState(randomImageURLs.slice(0, 15));
  const [nextImages, setNextImages] = useState(randomImageURLs.slice(15, 30));

  const setRImages = async () =>{
    setRandomImages(nextImages);
  }

  const setNImages = async () =>{
    setNextImages(randomImageURLs.slice(30, 45));
  }

  useEffect(() => {
    setTimeout(async() => {
      await setRImages()
      await setNImages()
    }, 12000);
  }, [randomImages]);
  

  return (
    <div className={styles.wrapper}>
    <Intro />
    <HorizontalRule />
    <FellaStrip randomImages={randomImages} nextImages={nextImages} />
    <HorizontalRule />
    <WhoWeAre />
    </div>
  )
}
