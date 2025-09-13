import { useState } from 'react'
import styles from './index.module.css'
import Icon from '../../../../../components/Icon/Icon';
import Text from '../../../../../components/Text';
import CardNotifier from './CardNotifier';
import type { TProvider } from '../../../../../types/notifiers';
import capitalizeFirstLetter from '../../../../../helpers/capitalizeFirstLetter';
import { useAppSelector } from '../../../../../app/store/hooks';
import useNotifierOptions from '../../../../../hooks/notifiers/useNotifierOptions';
interface Props {
    provider: TProvider,
    serverId: number
}
const SectionNotifiers = ({provider, serverId}: Props) => {
    const notifiers = useAppSelector(state => state.servers.separateServer.server?.notifiers);
    const [isShowContent, setIsShowContent] = useState<boolean>(true);
    const {addNotifier} = useNotifierOptions();
    
  return (
    <section className={`${styles.section} ${!isShowContent ? styles.hide : ''}`}>
        <div className={styles.head}>
            <div className={styles.row}>
                <Icon name={provider} width={20}/>
                <Text type="large" weight={600}>
                    {capitalizeFirstLetter(provider)}
                </Text>
            </div>
            <div className={styles.line}></div>
            <button 
                className={!isShowContent ? styles.rotate : ''}
                onClick={() => setIsShowContent(c => !c)}
            >
                <Icon name='arrow_bottom' width={15} height={20} color={2} />
            </button>
        </div>
        <div className={styles.content}>
            {notifiers && notifiers?.length > 0 && notifiers.filter(n => n.provider === provider).map(n => (
                <CardNotifier 
                    key={n.id}
                    id={n.id}
                    active={n.active} 
                />
            ))}
            <button className={styles.add} onClick={() => addNotifier(serverId, provider)}>
                <Icon name="plus" width={12}/>
                <Text type="small" weight={500}>Add Notifier</Text>
            </button>
        </div>
    </section>
  )
}

export default SectionNotifiers