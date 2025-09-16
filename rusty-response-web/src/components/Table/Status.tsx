import type { FC } from 'react'
import getServerStatus from '../../helpers/servers/getServerStatus'
import type { IServer } from '../../types/servers'
import Text from '../Text'
import styles from './index.module.css'
import lowerFirstLetter from '../../helpers/lowerFirstLetter'

interface Props {
    isTurned: IServer["is_turned_on"], 
    statusCode: IServer["last_seen_status_code"]
}
const Status: FC<Props> = ({isTurned, statusCode}) => {
    const status = getServerStatus(isTurned, statusCode);
    const statusClass = styles[lowerFirstLetter(status)];
  return (
    <div className={`${styles.row} ${statusClass}`}>
        <div className={styles.circle}></div>
        <Text type='tiny'>
            {status}
        </Text>
    </div>
  )
}

export default Status