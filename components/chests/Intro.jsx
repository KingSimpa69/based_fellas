import styles from "../../styles/chests.module.css"

const Intro = () => {
    return(
        <div className={styles.h2}>
            Welcome to CHESTS, a game of chance and luck.<br/>A set number of players deposit ETH into a chest.<br />Once full, a lucky player is chosen to keep everything inside.
        </div>
    )
}

export default Intro