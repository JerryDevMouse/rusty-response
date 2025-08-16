export interface IServer {
    id: number,
    user_id: number,
    name: string,
    url: string,
    timeout: number,
    interval: number,
    last_seen_status_code: null | number,
    last_seen_reason: null | number,
    is_turned_on: boolean,
    created_at: any,
    updated_at: any
}
// todo: Date type