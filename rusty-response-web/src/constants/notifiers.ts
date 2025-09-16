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