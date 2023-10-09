import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import styles from '../styles/collection.module.css';
import Filter from '@/components/collection/Filter';
import HorizontalRule from '@/components/HorizontalRule';
import FellaModal from '@/components/collection/FellaModal';

const Loader = dynamic(
  () => import('@/components/collection/Loader'),
  { ssr: false }
)

export default function Collection() {

  const [modal,modalOpen] = useState(false)
  const [active,setActive] = useState(0)
  const [activeMeta,setActiveMeta] = useState([])
  const [id,setId] = useState("")
  const [earrings,setEarrings] = useState("")
  const [eyes,setEyes] = useState("")
  const [head,setHead] = useState("")
  const [mouth,setMouth] = useState("")
  const [necklace,setNecklace] = useState("")
  const [outfit,setOutfit] = useState("")
  const [type,setType] = useState("")

  const toggleModal = (id) => {
    setActive(id)
    modalOpen(!modal)
  }

  const filterProps = {
    id,
    earrings,
    eyes,
    head,
    mouth,
    necklace,
    outfit,
    type,
  };

  return (
    <div className={styles.wrapper}>
    <FellaModal activeMeta={activeMeta} id={active} open={modal} setOpen={modalOpen} />
    <HorizontalRule />
    <h1 className={styles.h1}>Collection</h1>
    <HorizontalRule />
    <Filter
      id={id}
      setId={setId}
      setEarrings={setEarrings}
      setEyes={setEyes}
      setHead={setHead}
      setMouth={setMouth}
      setNecklace={setNecklace}
      setOutfit={setOutfit}
      setType={setType} />
    <HorizontalRule />
    <Loader setActiveMeta={setActiveMeta} toggleModal={toggleModal} filter={filterProps} />
    </div>
  )
}
