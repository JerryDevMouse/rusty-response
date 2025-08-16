import type { FC } from 'react'
import Text from '../Text'
import styles from './index.module.css'
import lowerFirstLetter from '../../helpers/lowerFirstLetter'
interface Props {
    name: string, 
    afterText: string
}
const Slider: FC<Props> = ({name, afterText}) => {
    const camelName = lowerFirstLetter(name).replaceAll(' ', '');

  return (
    <div className={styles.col}>
        <label htmlFor={camelName}>
            <Text type='tiny' color={5}>{name}</Text>
        </label>
        <div className={styles.rowinput}>
            <label className={styles.switch} id='sw'>
                <input type='checkbox' id={camelName} name={camelName}/>
                <span className={styles.slider}></span>
            </label>
            <Text type='tiny'>{afterText}</Text>
        </div>
    </div>
  )
}

export default Slider