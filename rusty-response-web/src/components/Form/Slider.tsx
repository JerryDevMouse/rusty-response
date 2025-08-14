import type { FC } from 'react'
import Text from '../Text'
import styles from './index.module.css'
interface Props {
    name: string, 
    afterText: string
}
const Slider: FC<Props> = ({name, afterText}) => {
  return (
    <div className={styles.col}>
        <label htmlFor={name}>
            <Text type='tiny' color={5}>{name}</Text>
        </label>
        <div className={styles.rowinput}>
            <label className={styles.switch} id='sw'>
                <input type='checkbox' id={name}/>
                <span className={styles.slider}></span>
            </label>
            <Text type='tiny'>{afterText}</Text>
        </div>
    </div>
  )
}

export default Slider