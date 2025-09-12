import { useNavigate, useParams } from "react-router";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../helpers/constants";
import type { IServer } from "../../types/servers";
import { useAppDispatch } from "../../app/store/hooks";
import { addServer, editServer, setSeparateServer, setSeparateServerLoading } from "../../app/store/slices/serversSlice";
import useCatchError from "../useCatchError";
import { useEffect } from "react";

function getData (formData: FormData) {
    return [
        formData.get('serverName'), 
        formData.get('serverURL'),
        Number(formData.get('timeout')),
        Number(formData.get('interval')),
        Boolean(formData.get('status')),
    ]
} 

function useCreateOrEditServer(type: 'Create' | 'Edit') {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const catchError = useCatchError();

    useEffect(() => {
        if (type === 'Edit') {
            const fetchServer = async () => {
                try {
                    dispatch(setSeparateServerLoading(true));
                    const serverData = await apiRequest<IServer>(`${API.server}${id}`);
              
                    dispatch(setSeparateServer({
                        ...serverData,
                        notifiers: [],
                    }));
                } catch (error) {
                    catchError(error)
                } finally {
                    dispatch(setSeparateServerLoading(false));
                    
                }
            }
            fetchServer();
        }
        return () => {
            dispatch(setSeparateServer(null));
        }
    }, [id])

    const createOrEditServer = async (formData: FormData) => {
        const [name, url, timeout, interval, is_turned_on] 
        = getData(formData);
    
        try {
            const resServer = await apiRequest<IServer>(`${API.server}${id ? id : ''}`, {
                method: (type === 'Create') ? 'POST' : 'PUT',
                body: { 
                    name, url, 
                    timeout, interval, 
                    is_turned_on
                }
            })
            if (type === 'Create') {
                dispatch(addServer(resServer));
            } else {
                dispatch(editServer(resServer))
            }
            navigate('/dashboards/servers')
        } catch (error) {
            catchError(error)
        }
    }

    return createOrEditServer
}

export default useCreateOrEditServer