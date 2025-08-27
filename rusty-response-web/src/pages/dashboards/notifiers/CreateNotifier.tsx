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
  const createNotifier = () => {};
  const {handleCancel, handleSubmit} = useForm(createNotifier);

  return (
    <Form.Container onSubmit={handleSubmit}>
      <Form.Title>Create Server</Form.Title>
      <Form.Section subtitle='Notifier Information'>
        <Form.Row>
          <Form.Select options={notifierOperatorsList}/>
        </Form.Row>
      </Form.Section>
      <Form.Section subtitle='Monitoring Settings'>
        <Form.Row>
          <Form.Input type='number' name='Timeout' 
            help='The interval between server checks (seconds)'
            defaultValue={10}
          />
          <Form.Input type='number' name='Interval'
            help='The interval between server checks (seconds)'
            defaultValue={60}
          />
        </Form.Row>
        <Form.Row>
          <Form.Slider name='Status' afterText='Active'/>
        </Form.Row>
      </Form.Section>
      <Form.Buttons 
        handleCancel={handleCancel}
        submitText='Create Server'
      />
    </Form.Container>
  )
}

export default CreateNotifier