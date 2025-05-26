'use client'
import styles from './Loading.module.scss'

type Props = {
    fullScreen?: boolean;
}

const Loading: React.FC<Props> = ({ fullScreen }) => {
    return (
        <div className={
            `${styles.container} ${fullScreen && styles['full-screen']}`
        }>
            <div className={styles['grid-big']}>
                {Array.from({ length: 25 }).map((_, i) => <div key={i} className={styles["cell-1"]} />)}
            </div>
        </div>
    )
}

export default Loading;