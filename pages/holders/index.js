import styles from "@/styles/holders.module.css"
import HorizontalRule from '@/components/HorizontalRule';
import Table from "@/components/holders/Table"

const Holders = ({windowSize}) => {


return (
    <div className={styles.wrapper}>
      <HorizontalRule />
      <h1 className={styles.h1}>Holders</h1>
      <p className={styles.threehnote}>Blockchain is queried once per hour.</p>
      <HorizontalRule />
      <Table windowSize={windowSize}/>
    </div>
  );
};

export default Holders;
