import { useNavigate } from "react-router"
import ApiError from "../helpers/ApiError";

const useCatchError = () => {
    const navigate = useNavigate();

    const catchError = (error: unknown) => {
        if (error instanceof ApiError) {
            error.log();
            if (error.status === 401) navigate('/auth/signin')
        } else {
            console.log('Unexpected error');
        }
    }
    return catchError
}

export default useCatchError