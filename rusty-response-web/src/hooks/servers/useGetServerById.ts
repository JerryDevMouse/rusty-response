import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store/hooks'
import type { IServer } from '../../types/servers'
import apiRequest from '../../helpers/apiRequest';
import { API } from '../../helpers/constants';
import useCatchError from '../useCatchError';

const useGetServerById = (id: IServer['id']) => {
    const [server, setServer] = useState<IServer | null>(null);
    // const [loading, setLoading] = useState(true);
    
    const servers = useAppSelector(state => state.servers.servers.list);
    const catchError = useCatchError();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoading(true);
                const stateServer = servers.find(s => s.id === id);
                
                if (stateServer) {
                    setServer(stateServer);
                    // setLoading(false);
                    return;
                }

                const serverData = await apiRequest<IServer>(`${API.server}${id}`);
                setServer(serverData);
            } catch (err) {
                catchError(err);
            } finally {
                // setLoading(false);
            }
        };

        fetchData();
    }, [id, servers, catchError]);

    return { server,  };
};

export default useGetServerById