import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import styles from '@/styles/collection.module.css';
import Filter from '@/components/collection/Filter';
import HorizontalRule from '@/components/HorizontalRule';
import FellaModal from '@/components/collection/FellaModal';
import { useRouter } from 'next/router';

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

  const router = useRouter()

  const getMeta = async (id) => {
    const response = await fetch(`/api/nft?from=1&to=2&id=${id}`)
    const data = await response.json();
    setActiveMeta(await data.nfts[0].attributes)
  }

  useEffect(() => {
    getMeta(active)
  }, [active])
  

  useEffect(() => {
    if(router.query.collection){
      if(router.query.collection[1] !== undefined){
        toggleModal(parseInt(router.query.collection[1]))
        modalOpen(true)
      }
    }
  }, [router])
  

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

  const setFilters = {
    setId,
    setEarrings,
    setEyes,
    setHead,
    setMouth,
    setNecklace,
    setOutfit,
    setType
  }

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
      setType={setType} 
      filters={filterProps}/>
    <HorizontalRule />
    <Loader setActiveMeta={setActiveMeta} toggleModal={toggleModal} filter={filterProps} set={setFilters} />
    </div>
  )
}
