import type { TFontSizeCategories } from "./types";

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

const urlApi = '/api/v1';

export {fontSizeCategories, AuthPageRedirectOffer, urlApi}