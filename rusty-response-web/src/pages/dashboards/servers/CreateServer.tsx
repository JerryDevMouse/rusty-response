import { Form } from '../../../components/Form'
import Text from '../../../components/Text'
import styles from '../../../components/Form/index.module.css' //temporary

const CreateServer = () => {
  return (
    <Form.Container>
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
      <div className={styles.btns}>
        <button className={styles.btn}><Text type='small'>Cancel</Text></button>
        <button className={styles.btnmain}><Text type='small'>Create Server</Text></button>
      </div>
    </Form.Container>
  )
}

export default CreateServer