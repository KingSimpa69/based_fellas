import { useEffect, useState } from "react";
import styles from "../../styles/owned.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransferModal from "./TransferModal";

const Loader = ({ address, alert }) => {
  const [owned, setOwned] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [activeTransfer, setActiveTransfer] = useState(null)
  let timeoutId;

  useEffect(() => {
    const checkOwnership = async () => {
      if (address !== undefined) {
        try {
          const response = await fetch(`/api/getowned?addy=${address}`);
          const body = await response.json();
          setOwned(body);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (address !== undefined) {
      checkOwnership();
    }
  }, [address]);

  const handleMouseEnter = (icon) => {
    clearTimeout(timeoutId);
    setHoveredId(icon);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setHoveredId(null);
    }, 50);
  };

  const transfer = (e) => {
    setActiveTransfer(e);
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
  };

  return (
    <div className={styles.loader}>
      {owned.map((id) => (
        <div key={id} className={styles.fellacont}>
          <div className={styles.fellaoverlay}>
            <h1>
              {hoveredId === "idcard"
                ? "META"
                : hoveredId === "image"
                ? "IMAGE"
                : hoveredId === "airplane"
                ? "SEND"
                : id}
            </h1>
            <div className={styles.actions}>
              <a href={`https://ipfs.io/ipfs/bafybeigr7b3cbyrhyjnmv6nx7itr7v25ghqqhfzb23owwvtmaj7vh5vlr4/${id}`} target="_blank">
                <div
                  className={styles.action}
                  onMouseEnter={() => handleMouseEnter("idcard")}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon icon="fa-regular fa-id-card" />
                </div>
              </a>
              <a href={`https://ipfs.io/ipfs/bafybeihox5skzzewbpyf6crsgxddcxkyrssy4wpbcc4dchpbyd55zaft5m/${id}.png`} target="_blank">
                <div
                  className={styles.action}
                  onMouseEnter={() => handleMouseEnter("image")}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon icon="fa-regular fa-image" />
                </div>
              </a>
              <div
                className={styles.action}
                onMouseEnter={() => handleMouseEnter("airplane")}
                onMouseLeave={handleMouseLeave}
                onClick={()=>transfer(id)}
              >
                <FontAwesomeIcon icon="fa-regular fa-paper-plane" />
              </div>
            </div>
          </div>
          <Image
            alt={`fella#${id}`}
            fill={true}
            src={`/images/fellas/${id}.png`}
          />
        </div>
      ))}
      {owned.length === 0 && "You don't own any Based Fellas!"}

      <TransferModal
        alert={alert}
        showModal={showTransferModal}
        closeModal={closeTransferModal}
        account={address}
        id={activeTransfer}
      />
    </div>
  );
};

export default Loader;