import { Form } from '../../../components/Form'
import useForm from '../../../hooks/useForm'

const CreateServer = () => {
  const createServer = () => {}; // fetch hook
  const {handleCancel, handleSubmit} = useForm(createServer);

  return (
    <Form.Container onSubmit={handleSubmit}>
      <Form.Title>Create Server</Form.Title>
      <Form.Section subtitle='Server Information'>
        <Form.Row>
          <Form.Input type='text' name='Server Name'/>
          <Form.Input type='text' name='Server URL'/>
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
        handleSubmit={createServer}
        submitText='Create Server'
      />
    </Form.Container>
  )
}

export default CreateServer