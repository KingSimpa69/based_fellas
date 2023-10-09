import styles from "@/styles/collection.module.css"

const Dropdown = ({attributes,type,setFilter}) => {
    return(
    <select onChange={e => setFilter(e.target.value === `${type.toUpperCase()}` ? "" : e.target.value)} className={styles.dropdown} name={type} id={type}>
        {attributes.map((e)=>{
            return(
                <option className={styles.option} key={e} value={e}>{e}</option>
            )
        })}
    </select>
    )
}

export default Dropdown