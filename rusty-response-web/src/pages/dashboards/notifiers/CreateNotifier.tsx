import { useCallback, useState } from 'react'
import { Form } from '../../../components/Form'
import useForm from '../../../hooks/useForm'
const notifierOperatorsList = [
  {
    name: 'Telegram',
    fields: [
      {
        name: 'Chat Id',
        type: 'string'
      },
      {
        name: 'Token',
        type: 'number'
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

const CreateNotifier = () => {
    const [option, setOption] = useState<string>('Telegram');
    const callSetOption = useCallback((value: string) => setOption(value), [])
  const createNotifier = () => {};
  const {handleCancel, handleSubmit} = useForm(createNotifier);

  return (
    <Form.Container onSubmit={handleSubmit}>
      <Form.Title>Create Notifier</Form.Title>
      <Form.Section subtitle='Notifier Information'>
        <Form.Row>
          <Form.Select options={notifierOperatorsList} 
            option={option} setOption={callSetOption}
            name='Provider'
          />
        </Form.Row>
        <Form.Row>
            {notifierOperatorsList.find(({name}) => name === option)?.fields.map(({name, type}) => (
              <Form.Input key={name} type={type} name={name} />
            ))}
        </Form.Row>
      </Form.Section>
      <Form.Section subtitle='Notifier Settings'>
        <Form.Row>
          <Form.TextArea name='Message'/>
        </Form.Row>
        <Form.Row>
          <Form.Slider name='Status' afterText='Active'/>
        </Form.Row>
      </Form.Section>
      <Form.Buttons 
        handleCancel={handleCancel}
        submitText='Create Notifier'
      />
    </Form.Container>
  )
}

export default CreateNotifier