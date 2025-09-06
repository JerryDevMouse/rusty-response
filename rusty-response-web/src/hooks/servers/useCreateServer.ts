import { useNavigate } from "react-router";
import ApiError from "../../helpers/ApiError";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../helpers/constants";
import type { IServer } from "../../types/servers";
import { useAppDispatch } from "../../app/store/hooks";
import { addServer } from "../../app/store/slices/serversSlice";

function getData (formData: FormData) {
    return [
        formData.get('serverName'), 
        formData.get('serverURL'),
        Number(formData.get('timeout')),
        Number(formData.get('interval')),
        Boolean(formData.get('status')),
    ]
} 

function useCreateServer() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const createServer = async (formData: FormData) => {
        const [name, url, timeout, interval, is_turned_on] 
        = getData(formData);
    
        try {
            const resServer = await apiRequest<IServer>(API.server, {
                method: 'POST',
                body: { 
                    name, url, 
                    timeout, interval, 
                    is_turned_on
                }
            })
            dispatch(addServer(resServer));
            navigate('/dashboards/servers')
        } catch (error) {
            if (error instanceof ApiError) {
                error.log();
                if (error.status === 401) navigate('/auth/signin');
            }
        }
    }

    return createServer
}

export default useCreateServer