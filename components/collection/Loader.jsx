import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce'
import styles from '../../styles/collection.module.css';
import { useInView } from 'react-intersection-observer';
import Fella from './Fella';
import delay from '@/functions/delay';

const Loader = ({filter,toggleModal,setActiveMeta}) => {
  const [nfts, setNFTs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedID = useDebounce(filter.id, 750)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fetchNFTs = async (currentPage,reset) => {
    
    if( reset!== true ){
      if (loading || !hasMore) return;
      setLoading(true);
    }

    !reset ? setPage((prevPage) => prevPage + 10) : setPage(1)

    const queryParams = Object.entries(filter)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await fetch(`/api/nft?from=${currentPage}&to=${currentPage + 9}&${queryParams}`);

    if (response.ok) {
      const data = await response.json();
        if (data.nfts.length === 0) {
          setHasMore(false);
        } else if (currentPage === 1) {
          setNFTs(data.nfts);
        } else {
          setNFTs((prevNFTs) => [...prevNFTs, ...data.nfts]);
        }
    }
    setLoading(false);
  };

  const setPageAndFetchNFTs = async () => {
    setNFTs([]);
    setHasMore(true)
    await delay(250)
    await fetchNFTs(1,true);
  };

  useEffect(() => {
    setPageAndFetchNFTs();
  }, [
    filter.earrings,
    filter.eyes,
    filter.head,
    filter.mouth,
    filter.necklace,
    filter.outfit,
    filter.type,
  ]);

  useEffect(() => {
    setPageAndFetchNFTs();
  }, [debouncedID]);

  useEffect(() => {
    if (inView && !loading) {
      fetchNFTs(page,false);
    }
  }, [inView, page, loading]);

  return (
    <div className={styles.fellas}>
      {nfts.map((nft, index) => (
        <div onClick={()=>{
          toggleModal(nft._id)
          setActiveMeta(nft.attributes)
          }} ref={index === nfts.length - 1 ? ref : null} key={`${nft._id}-${index}`}>
          <Fella nfts={nfts} nft={nft} index={index} />
        </div>
      ))}
      {loading && <p className={styles.p}>Loading...</p>}
    </div>
  );
};

export default Loader;
