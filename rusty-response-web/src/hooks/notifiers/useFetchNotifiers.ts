import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import apiRequest from '../../helpers/apiRequest'
import type { INotify } from '../../types/notifiers'
import { API } from '../../constants/api'
import { setNotifiers, setNotifiersLoading } from '../../app/store/slices/serversSlice'
import useCatchError from '../useCatchError'

const useFetchNotifiers = () => {
    const dispatch = useAppDispatch();
    const servers = useAppSelector(state => state.servers.servers);
    const catchError = useCatchError()

    useEffect(() => {
        if (!servers.loading && servers.list.length > 0) {
            const getNotifiers = async () => {
                try {
                    dispatch(setNotifiersLoading(true))
                    const finalResponse = await apiRequest<INotify[]>(API.notify);
                    dispatch(setNotifiers(finalResponse))
                } catch(error) {
                    catchError(error)
                } finally {
                    dispatch(setNotifiersLoading(false))
                }
            }

            getNotifiers()
        }
    }, [servers.lastUpdate])
}

export default useFetchNotifiers