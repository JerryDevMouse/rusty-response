import { Form } from '../../../components/Form';
import useForm from '../../../hooks/useForm';
import useFormNotifier from '../../../hooks/notifiers/useFormNotifier';
import { notifierOperatorsList } from '../../../helpers/constants';

interface Props {
    requestMethod: 'POST' | 'PUT'
}
const FormNotifier = ({requestMethod}: Props) => {
    const { onSubmitRequest, servers, optionProvider, 
      optionServer, setOptionProvider, setOptionServer } = useFormNotifier(requestMethod);
    const {handleCancel, handleSubmit} = useForm(onSubmitRequest);

  return (
    <Form.Container onSubmit={handleSubmit}>
      <Form.Title>Create Notifier</Form.Title>
      <Form.Section subtitle='Notifier Information'>
        <Form.Row>
          <Form.Select options={servers} 
            option={optionServer} 
            setOption={setOptionServer}
            name='Server Name'
          />
          <Form.Select options={notifierOperatorsList} 
            option={optionProvider} setOption={setOptionProvider}
            name='Provider'
            icons
          />
        </Form.Row>
        <Form.Row>
          {notifierOperatorsList.find(({name}) => name === optionProvider)?.fields.map(({name, type}) => (
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

export default FormNotifier