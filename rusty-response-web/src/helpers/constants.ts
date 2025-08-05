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
    signup: '/api/v1/account/signup',
    signin: '/api/v1/account/signin',
    verify: '/api/v1/account/verify',
    server: '/api/v1/server/',
    notify: '/api/v1/notify/',
    notifyServer: '/notify/server/'
}; 

export {fontSizeCategories, AuthPageRedirectOffer, API}