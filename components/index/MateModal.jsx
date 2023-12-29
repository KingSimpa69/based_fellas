import styles from "@/styles/index.module.css"

const MateModal = ({toggle, modalStatus, mate}) => {

    const teamBio = [
        "Meet underdog, a true Renaissance man with a lifelong passion for the synthesis of art and science. Beginning his career in the film industry, he adeptly managed high-profile clients in Los Angeles. Eventually his passion for finance, art, and the future in blockchain technology and web3 took over. Beyond analyzing charts and diving into cutting-edge projects, he currently professionally brews beer, manages a restaurant, tends to his cats, and nurtures his exotic and humble garden.",
        "Meet cordelleonbase, residing in the Great White North of Canada, is a passionate individual with diverse interests including personal development, house music, crypto, comics, space rocks, and history. Introduced to the world of cryptocurrency in late 2020, Cordelle's fascination led him to pursue web development education. With an insatiable thirst for knowledge and a deep passion for Web 3, Cordelle is dedicated to staying at the forefront of technology and blockchain, ensuring his continued engagement for years to come.",
        "Meet Alex, of Canada, whose lifelong addiction to computers has been unwavering. From a young age, he would make daily walks to the library just to get on a computer. He eventually started constructing his own computers using parts salvaged from the local landfill. The bond between Alex and computers became inseparable. Around age 12, Alex ventured into the realm of static webpages, crafting code in Windows Notepad. Over the years, his insatiable curiosity led him to master backend skills, allowing him to effortlessly set up any server he might need. Despite facing obstacles within the failed public school system, which led him to drop out in grade 10, Alex remained undeterred in his pursuit of web knowledge. His commitment to self-learning and exploration became the driving force behind his remarkable journey. His journey continued with an unnamed crypto project on a dormant blockchain. Although the project did not succeed, it proved to be incredibly fruitful as it became a classroom for learning solidity and working with EVM-style blockchains. Presently, Alex is a father of one, managing 50-hour workweeks as a foreman at a concrete company. Despite the demands of his profession, he dedicates every spare moment to expanding his expertise in web development. Especially in web3 where his heart lies in building trustless applications. He hopes to one day make it as a successful coder and break the chains of society."
    ]

    return(
        modalStatus?(
                <div className={styles.mateModal}>
                <div className={styles.modalCont}>
                    <p>
                        {teamBio[mate]}
                    </p>
                    <div onClick={()=>toggle(!modalStatus)} className={styles.modalClose}>EXIT</div>
                </div>
            </div>
            ):(null)
    )
}

export default MateModal