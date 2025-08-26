import { useAppDispatch } from "../../app/store/hooks";
import { deleteServerById } from "../../app/store/slices/serversSlice";
import ApiError from "../../helpers/ApiError";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../helpers/constants";


const useDeleteServer = () => {
    const dispatch = useAppDispatch();

    const deleteServer = async (id: number) => {
        try {
            await apiRequest(API.server + `${id}`, 
                {method: 'DELETE'}
            )
            dispatch(deleteServerById(id))
        } catch (error) {
            if (error instanceof ApiError) error.log()
        }
    }

    return deleteServer;
}

export default useDeleteServer