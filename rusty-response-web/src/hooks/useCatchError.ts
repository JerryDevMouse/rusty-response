import { useNavigate } from "react-router"
import ApiError from "../helpers/ApiError";
import useModalUI from "./useModalUI";

const useCatchError = () => {
    const navigate = useNavigate();
    const {showModal} = useModalUI();

    const catchError = (error: unknown) => {
        if (error instanceof ApiError) {
            showModal(error.message, "error")
            if (error.status === 401) {
                setTimeout(() => {
                    navigate('/auth/signin');
                }, 3000)
            }
        } else {
            showModal('Unexpected error', "error")
        }
    }
    return catchError
}

export default useCatchError