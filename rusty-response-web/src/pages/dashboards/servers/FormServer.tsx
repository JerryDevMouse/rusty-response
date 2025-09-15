import { useAppSelector } from '../../../app/store/hooks';
import { Form } from '../../../components/Form'
import Loading from '../../../components/Loading';
import ModalOptions from '../../../components/ModalOptions';
import useCreateOrEditServer from '../../../hooks/servers/useCreateOrEditServer';
import useServerOptions from '../../../hooks/servers/useServerOptions';
import useForm from '../../../hooks/useForm'
import ButtonOptions from './ServerPage/TabNotifiers/ButtonOptions';

const FormServer = ({type}: {type: 'Create' | 'Edit'}) => {
  const createOrEditServer = useCreateOrEditServer(type);
  const server = useAppSelector(state => state.servers.separateServer);
  const {deleteServer} = useServerOptions();
  
  const {handleCancel, handleSubmit} = useForm(createOrEditServer);

  return (
    <Loading.ConditionalLoader
      isLoading={type === 'Edit' && server.loading}
      loader={<Loading.Basic />}
    >
      <Form.Container onSubmit={handleSubmit}>
        {type === 'Edit' && 
          <ButtonOptions right size={28}>
            <ModalOptions.OptionLink 
              iconName='visit'    
              to={`/dashboards/servers/${server.server?.id}`}
              label='Visit'
            />
            <ModalOptions.OptionButton 
                iconName='delete'
                handleClick={() => deleteServer(server.server?.id!, true)}
                label='Delete'
            />
          </ButtonOptions>
        }
        <Form.Title>{type} Server</Form.Title>
        <Form.Section subtitle='Server Information'>
          <Form.Row>
            <Form.Input type='text' name='Server Name' key={server.server?.name} defaultValue={server.server?.name}/>
            <Form.Input type='text' name='Server URL' key={server.server?.url} defaultValue={server.server?.url}/>
          </Form.Row>
        </Form.Section>
        <Form.Section subtitle='Monitoring Settings'>
          <Form.Row>
            <Form.Input type='number' name='Timeout' 
              help='The interval between server checks (seconds)'
              key={server.server?.timeout}
              defaultValue={server.server?.timeout ?? 10}
              seconds
              />
            <Form.Input type='number' name='Interval'
              help='The interval between server checks (seconds)'
              key={server.server?.interval}
              defaultValue={server.server?.interval ?? 60}
              seconds
            />
          </Form.Row>
          <Form.Row>
            <Form.Slider name='Status' afterText='Active' 
              key={server.server?.id}
              defaultValue={Boolean(server.server?.is_turned_on)}
            />
          </Form.Row>
        </Form.Section>
        <Form.Buttons 
          handleCancel={handleCancel}
          submitText={`${type} Server`}
        />
      </Form.Container>
    </Loading.ConditionalLoader>
  )
}

export default FormServer