import type { FC } from 'react'
import Text from '../Text'
import lowerFirstLetter from '../../helpers/lowerFirstLetter'
import styles from './index.module.css'
import ContentCondition from '../ContentCodition'
interface Props {
    type: React.HTMLInputTypeAttribute,
    name: string,
    help?: string,
    defaultValue?: number
}
const Input: FC<Props> = ({type, name, help, defaultValue}) => {
    const camelName = lowerFirstLetter(name).replaceAll(' ', '');
  return (
    <div className={styles.col}>
        <label htmlFor={camelName}>
            <Text type='tiny' color={5}>{name}</Text>
            {help &&               
                <div className={styles.help}>
                    <div className={styles.icon}>i</div>
                    <div className={styles.helpcontent}>
                        <Text type='tiny' weight={600}>{name}</Text>
                        <Text type='tiny'>{help}</Text>
                    </div>
                </div>
            }
        </label>
        <ContentCondition
            condition={type === 'number' && defaultValue} 
            fallback={            
                <input type={type} id={camelName} name={camelName} placeholder={`Enter ${name}`} required/>
            }   
        >
            <div className={styles.rowinput}>
                <input type="number" id={camelName} name={camelName} 
                    defaultValue={defaultValue} placeholder={`Enter ${name}`} required/>
                <Text type='tiny'>seconds</Text>
            </div>
        </ContentCondition>
    </div>
  )
}

export default Input