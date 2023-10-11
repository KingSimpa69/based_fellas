import Image from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useEffect, useState } from "react";
import styles from "@/styles/index.module.css";

const FellaStrip = ({ randomImages }) => {
  const [css0, setCss0] = useState("none");
  const { width } = useWindowSize();

  const setFellas = () => {
    const newImages =
      width > 768
        ? randomImages.slice(0, 15)
        : width > 480
        ? randomImages.slice(0, 10)
        : width < 480
        ? randomImages.slice(0, 5)
        : randomImages;
    setImages(newImages);
  };

  useEffect(() => {
    setTimeout(() => {
      setCss0("animate__animated animate__fadeIn animate__slower");
    }, 1500);
    setTimeout(() => {
      setCss0("animate__animated animate__fadeOut animate__slower");
    }, 8000);
    setTimeout(() => {
      setFellas();
    }, 11000);
  }, [randomImages]);

  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(
      width > 768
        ? randomImages.slice(0, 15)
        : width > 480
        ? randomImages.slice(0, 10)
        : width < 480
        ? randomImages.slice(0, 5)
        : randomImages
    );
  }, [width, randomImages]);

  return (
    <div className={`${styles.fellas} ${css0}`}>
      {images.map((path, index) => (
        <div key={index} className={styles.fellacont}>
          <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={`fella-${path}`} fill={true} src={`/images/fellas/${path}`} unoptimized/>
        </div>
      ))}
    </div>
  );
};

export default FellaStrip;