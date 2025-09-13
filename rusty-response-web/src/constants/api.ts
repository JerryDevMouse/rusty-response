import type { TRoutes } from "../types/api";

export const API: TRoutes = {
    signup: '/api/v1/account/signup',
    signin: '/api/v1/account/signin',
    verify: '/api/v1/account/verify',
    server: '/api/v1/server/',
    notify: '/api/v1/notify/',
    notifyServer: '/api/v1/notify/server/'
}; 