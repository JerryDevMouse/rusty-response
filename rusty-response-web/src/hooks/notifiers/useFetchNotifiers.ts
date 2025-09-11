import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import apiRequest from '../../helpers/apiRequest'
import type { IResponse } from '../../helpers/types'
import type { INotify } from '../../types/notifiers'
import { API } from '../../helpers/constants'
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
                    const responseFindTotal = await apiRequest<IResponse<INotify>>(API.notify + '?limit=10&offset=0'); // temporarily, until the API route is redesigned 
                    if (responseFindTotal.total === responseFindTotal.items.length) {
                        dispatch(setNotifiers(responseFindTotal.items));
                        return;
                    }
                    const finalResponse = await apiRequest<IResponse<INotify>>(API.notify + `?limit=${responseFindTotal.total}&offset=0`);
                    dispatch(setNotifiers(finalResponse.items))
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