import { Form } from '../../../components/Form';
import useForm from '../../../hooks/useForm';
import useFormNotifier from '../../../hooks/notifiers/useFormNotifier';
import { notifierProviderFields } from '../../../constants/notifiers';
import { getCredentialValue } from '../../../types/notifiers';
interface Props {
    type: 'Create' | 'Edit'
}

const FormNotifier = ({type}: Props) => {
  const { onSubmitRequest, servers, optionProvider, 
    optionServer, setOptionProvider, setOptionServer, separateNotifier } = useFormNotifier(type);
  const {handleCancel, handleSubmit} = useForm(onSubmitRequest);

  return (
    <Form.Container onSubmit={handleSubmit}>
      <Form.Title>{type} Notifier</Form.Title>
      <Form.Section subtitle='Notifier Information'>
        <Form.Row>
          <Form.Select options={servers} 
            option={optionServer} 
            setOption={setOptionServer}
            name='Server Name'
          />
          <Form.Select options={notifierProviderFields} 
            option={optionProvider} setOption={setOptionProvider}
            name='Provider'
            icons
          />
        </Form.Row>
        <Form.Row>
          {notifierProviderFields.find(({name}) => name === optionProvider)?.fields.map(({name, type}) => (
            <Form.Input 
              key={name} 
              type={type} 
              name={name} 
              defaultValue={getCredentialValue(separateNotifier?.credentials, name) ?? ''}  
            />
          ))}
        </Form.Row>
      </Form.Section>
      <Form.Section subtitle='Notifier Settings'>
        <Form.Row>
          <Form.TextArea name='Message' defaultValue={separateNotifier.format}/>
        </Form.Row>
        <Form.Row>
          <Form.Slider name='Status' afterText='Active' defaultValue={separateNotifier.active}/>
        </Form.Row>
      </Form.Section>
      <Form.Buttons 
        handleCancel={handleCancel}
        submitText={`${type} Notifier`}
      />
    </Form.Container>
  )
}

export default FormNotifier