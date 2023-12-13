import styles from "../../styles/chests.module.css";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { useRouter } from "next/router";
import Chest from "@/components/chests/Chest";
import CHESTS from "@/chests.json";


export default function Chests({alert}) {
    const [refresh, triggerRefresh] = useState(0)
    const [activeCase, setActiveCase] = useState("");
    const { isConnected, address } = useAccount();
    const router = useRouter();

    const notConnectedMessage = (<div>Not Connected</div>);

    const checkForDynamic = () => {
        if (router.query.chests?.[0] !== undefined) {
            const currentCase = CHESTS.config.find(e => e.id === parseInt(router.query.chests[0]));
            //console.log(currentCase);
            setActiveCase(currentCase);
        }
    };

    useEffect(() => {
        let isMounted = true;
        isMounted && checkForDynamic();
        return () => {
            isMounted = false;
        };
    }, [router]);

    return (
        <div className={styles.body}>
            {isConnected ? (
                <>
                    <Chest alert={alert} refresh={refresh} triggerRefresh={triggerRefresh} contract={activeCase.addy}/>
                </>
            ) : (
                notConnectedMessage
            )}
        </div>
    );
}
