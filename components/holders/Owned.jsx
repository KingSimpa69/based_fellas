import { useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/holders.module.css";
import HorizontalRule from "../HorizontalRule";

const Owned = ({ ownedArray, addy }) => {

  useEffect(() => {
    let mounted = true;
    mounted && ownedArray.length > 0 && console.log(ownedArray);
    return () => {
      mounted = false;
    };
  }, [ownedArray]);
  

  return (
    <>
      <HorizontalRule />
      <h1 className={styles.h2}>{addy}</h1>
      <HorizontalRule />
      <div className={styles.fellawrapper}>
        {ownedArray.map((e, index) => {
          return (
            <div key={index} className={styles.fella}>
              <Image alt={`fella-${e}`} src={`/images/fellas/${e}.png`} width={100} height={100} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Owned;
