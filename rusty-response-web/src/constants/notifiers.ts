import type { INotify } from "../types/notifiers"

export const notifierProviderFields = [
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

export const initialNotifier: INotify = {
  id: 0,
  active: false,
  created_at: '',
  credentials: {
    chat_id: null,
    token: null
  },
  format: '',
  provider: "telegram",
  server_id: 0,
  updated_at: '',
  user_id: 0
}