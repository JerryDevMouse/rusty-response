import { useNavigate } from "react-router";
import ApiError from "../../helpers/ApiError";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../helpers/constants";
import type { IServer } from "../../types/servers";

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
            console.log(resServer);
            navigate('/dashboards/servers')
        } catch (error) {
            if (error instanceof ApiError) error.log()
        }
    }

    return createServer
}

export default useCreateServer