import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import useCatchError from "./useCatchError";
import { setSeparateServer, setSeparateServerLoading, setSeparateServerNotifiers } from "../app/store/slices/serversSlice";
import apiRequest from "../helpers/apiRequest";
import { API } from "../helpers/constants";
import type { IServer } from "../types/servers";
import type { IResponse } from "../helpers/types";
import type { INotify } from "../types/notifiers";

const useGetDataById = (id: IServer['id']) => {
    const dispatch = useAppDispatch();
    const servers = useAppSelector(state => state.servers.servers.list);
    const catchError = useCatchError();

    useEffect(() => {
        const fetchData = async () => {
            const fetchNotifiers = async () => {
                const serverNotifiers = await apiRequest<IResponse<INotify>>(
                    `${API.notifyServer}${id}?limit=999&offset=0`
                ); // temporary query until the API changes                                
                dispatch(setSeparateServerNotifiers(serverNotifiers.items)); 
            }

            try {
                dispatch(setSeparateServerLoading(true))
                const stateServer = servers.find(s => s.id === id);
                
                if (stateServer) {
                    dispatch(setSeparateServer(stateServer));
                    fetchNotifiers()
                    return;
                }
                
                const serverData = await apiRequest<IServer>(`${API.server}${id}`);
                dispatch(setSeparateServer({
                    ...serverData,
                    notifiers: []
                }));
                fetchNotifiers()
            } catch (err) {
                catchError(err);
            } finally {
                dispatch(setSeparateServerLoading(false))
            }
        };

        fetchData();
    }, [id, servers]);
};

export default useGetDataById