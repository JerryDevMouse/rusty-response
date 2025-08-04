import type { TRoutes, TFontSizeCategories } from "./types";

const fontSizeCategories: TFontSizeCategories = {
    xxl: 1.5,
    xl: 1.375,
    large: 1.25,
    medium: 1.125,
    small: 1,
    tiny: 0.875
}
const AuthPageRedirectOffer = {
    In: 'Not a member yet?',
    Up: 'Already have an Account?'
}

const API: TRoutes = {
    signup: { path: '/api/v1/account/signup', method: ['POST'] },
    signin: { path: '/api/v1/account/signin', method: ['POST'] },
    verify: { path: '/api/v1/account/verify', method: ['GET'] },
    server: { path: '/api/v1/server/', method: ['POST', 'GET', 'PUT', 'DELETE'] },
    notify: { path: '/api/v1/notify/', method: ['POST', 'PUT', 'DELETE'] },
    notifyServer: { path: '/notify/server/', method: ['GET'] }
}; 

export {fontSizeCategories, AuthPageRedirectOffer, API}