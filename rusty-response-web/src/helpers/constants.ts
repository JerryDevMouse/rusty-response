import type { TRoutes, TFontSizeCategories, TsidebarNav } from "./types";

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
    notifyServer: '/api/v1/notify/server/'
}; 

const sidebarNav: TsidebarNav = {
    dashboards: ["overview", "servers", "notifiers"],
    pages: ['docs']
}

const notifierOperatorsList = [
  {
    name: 'Telegram',
    fields: [
      {
        name: 'Chat Id',
        type: 'number'
      },
      {
        name: 'Token',
        type: 'string'
      },
    ]
  },
  {
    name: 'Discord',
    fields: [
      {
        name: 'Discord Webhook',
        type: 'string'
      },
      {
        name: 'Embed Title',
        type: 'string'
      },
      {
        name: 'Embed Footer Content',
        type: 'string'
      },
    ]
  }
]

export {fontSizeCategories, AuthPageRedirectOffer, API, sidebarNav, notifierOperatorsList}