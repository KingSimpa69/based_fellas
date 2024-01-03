import { useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/holders.module.css";
import HorizontalRule from "../HorizontalRule";
import { shortenEthAddy } from "@/functions/shortenEthAddy";
import Link from "next/link";

const Owned = ({ ownedArray, addy, width }) => {

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
      <a href={`https://base.blockscout.com/address/${addy}`} target="_blank"><h1 className={styles.h2}>{width>450?addy:shortenEthAddy(addy)}</h1></a>
      <HorizontalRule />
      <div className={styles.fellawrapper}>
        {ownedArray.map((e, index) => {
          return (
            <div key={index} className={styles.fella}>
              <Link href={`/collection/${e}`}>
                <Image alt={`fella-${e}`} src={`/images/fellas/${e}.png`} width={100} height={100} />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Owned;
