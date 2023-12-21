import styles from "@/styles/christmas.module.css";
import HorizontalRule from "@/components/HorizontalRule";
import Image from "next/image";
import { useState } from "react"
import { useEthersSigner } from "@/hooks/ethers"

export default function Christmas({alert}) {

    const chainId = 8453
    const signer = useEthersSigner(chainId)

    const [xuser,setXuser] = useState("")


    const signMessage = async () => {
        try{
            if(xuser!==""){
                const address = await signer.getAddress();
                const message = xuser;
                const signature = await signer.signMessage(message)
                const response = await fetch('/api/christmasig', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      address: address,
                      message: message,
                      signature,
                    }),
                  });
            
                  const result = await response.json();
                  result.message === "Signature verified!" ? alert("success",result.message):
                  alert("error",result.message)
            } else {
                alert("info","Please enter your X username")
            }
        } catch (e){
            if(e.message === "signer is undefined"){
                console.log(e.message)
                alert("error","No wallet provider connected")
            } else {
                console.log(e.message)
            }
            
        }

    }
  return (
    <>
      <div className={styles.bghack} />
      <div className={styles.santaisfat}>
        <HorizontalRule />
        <h1 className={styles.h1}>MERRY CHRISTMAS</h1>
        <HorizontalRule />
        <p className={styles.p}>
          We want to express our sincere gratitude to you for contributing
          to the success of our &quot;Very Based Christmas Party&quot; - it truly became
          an unforgettable event!
          <br />
          <br />
          Your presence added a wonderful sense of community to our gathering,
          and it simply wouldn&quot;t have been as special without you!
          <br />
          <br />
          A special shoutout goes to all the @BuildOnBase communities, projects,
          and users who joined us. Your support is immensely appreciated.
          <br />
          <br />
          As we continue to celebrate the holiday season, may the spirit of
          creativity and community linger with you. Thank you for being a part
          of this historic event.
          <br />
          <br />
          Feel free to sign our guestbook below to confirm your attendance!
          Signatures are gasless and require no approval or transfer functions.
          We have a little surprise in store for each attendee of the Very Based
          Christmas Party!🎄
        </p>
        <input className={styles.username} placeholder="X USERNAME" onChange={(e)=>setXuser(e.target.value)}/>
        <div onClick={()=>{signMessage()}} className={styles.sigbutton}>
        <p className={styles.littlesig}>{xuser}</p>
          <Image src={"/images/sig.png"} width={120} height={120} />
          <p>SIGN NAME</p>
        </div>
      </div>
    </>
  );
}
