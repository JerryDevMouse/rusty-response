import { useAppDispatch } from "../../app/store/hooks";
import { deleteServerById } from "../../app/store/slices/serversSlice";
import apiRequest from "../../helpers/apiRequest";
import { API } from "../../helpers/constants";
import useCatchError from "../useCatchError";


const useDeleteServer = () => {
    const dispatch = useAppDispatch();
    const catchError = useCatchError();

    const deleteServer = async (id: number) => {
        try {
            await apiRequest(API.server + `${id}`, 
                {method: 'DELETE'}
            )
            dispatch(deleteServerById(id))
        } catch (error) {
            catchError(error)
        }
    }

    return deleteServer;
}

export default useDeleteServer