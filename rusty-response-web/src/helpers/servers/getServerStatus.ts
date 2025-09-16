import type { IServer } from '../../types/servers'

const getServerStatus = (
    isTurned: IServer['is_turned_on'], 
    statusCode: IServer['last_seen_status_code']
): 'Success' | 'Failed' | 'Pause' => {

    if (!isTurned) return 'Pause';
    
    if (statusCode === null || statusCode <= 299) {
        return 'Success'
    } else {
        return 'Failed'
    }
}
export default getServerStatus

