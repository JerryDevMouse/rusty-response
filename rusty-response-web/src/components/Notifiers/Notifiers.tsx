import { useEffect } from 'react'
import NotifierCard from './NotifierCard'
import styles from './index.module.css'
import apiRequest from '../../helpers/apiRequest'
import { API } from '../../helpers/constants'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import { setNotifiers, setNotifiersLoading } from '../../app/store/slices/serversSlice'
import type { IResponse } from '../../helpers/types'
import type { INotify } from '../../types/notifiers'

const Notifiers = () => {
  const dispatch = useAppDispatch();
  const servers = useAppSelector(state => state.servers.servers.list);

  useEffect(() => {
    const fetchNotifiers = async () => {
      dispatch(setNotifiersLoading(true))
      const notifiers = await apiRequest<IResponse<INotify>>(API.notify + '?limit=10&offset=0', {method: 'GET'});
      dispatch(setNotifiers(notifiers.items))
      dispatch(setNotifiersLoading(false))
    }
    fetchNotifiers();
  }, []);

  return (
    <section className={styles.section}>
      {servers.map(s => 
        <NotifierCard  
          key={s.id}
          serverId={s.id}
          serverName={s.name}
          serverURL={s.url}
          notifiers={s.notifiers}
        />

      )}
    </section>
  )
}

export default Notifiers