import styles from '../../styles/collection.module.css';
import eyes from "./attributes/eyes"
import head from "./attributes/head"
import earrings from "./attributes/earrings"
import mouth from "./attributes/mouth"
import necklace from './attributes/necklace';
import outfit from './attributes/outfit'
import {type} from "./attributes/type"
import Dropdown from './DropDown';

const Filter = (filter) => {

    const numberRegex = new RegExp(/^\d+$/)

    const numberFilter = (e) => {
        if (numberRegex.test(e) === true || e === "") {
          const int = parseInt(e);
          if (!isNaN(int) && int >= 0 && int <= 9999) {
            filter.setId(int);
          } else if (e === "") {
            filter.setId("");
          } else {
            null
          }
        } else return
      };

    return(
        <div className={styles.filterbox}>
            <input onChange={(e)=>{numberFilter(e.target.value)}} className={styles.input} placeholder='Fella #' value={filter.id} type="number" pattern="[0-9]*" inputMode="numeric"/>
            <Dropdown setFilter={filter.setEarrings} attributes={earrings} type="earrings" />
            <Dropdown setFilter={filter.setEyes}attributes={eyes} type="eyes" />
            <Dropdown setFilter={filter.setHead}attributes={head} type="head" />
            <Dropdown setFilter={filter.setMouth}attributes={mouth} type="mouth" />
            <Dropdown setFilter={filter.setNecklace}attributes={necklace} type="necklace" />
            <Dropdown setFilter={filter.setOutfit}attributes={outfit} type="outfit" />
            <Dropdown setFilter={filter.setType}attributes={type} type="type" />
        </div>
    )
}

export default Filter