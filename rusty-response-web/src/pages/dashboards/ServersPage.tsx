// import NoServers from '../../components/NoServers'
import styles from '../../components/Form/index.module.css'

import Text from "../../components/Text"
import { Form } from '../../components/Form'

const ServersPage = () => {
  return (
    // <NoServers text='To get started, add your first server'/>
    <>
    <Form.Title>Create Server</Form.Title>
    <Form.Section subtitle='Server Information'>
      <Form.SectionRow>
        <Form.Input type='text' name='Server Name'/>
        <Form.Input type='text' name='Server URL'/>
      </Form.SectionRow>
    </Form.Section>
    <Form.Section subtitle='Monitoring Settings'>
      <Form.SectionRow>
        <Form.Input type='number' name='Timeout' 
          help='The interval between server checks (seconds)'
          defaultValue={10}
        />
        <Form.Input type='number' name='Interval'
          help='The interval between server checks (seconds)'
          defaultValue={60}
        />
      </Form.SectionRow>
    </Form.Section>
    <div className={styles.btns}>
      <button className={styles.btn}><Text type='small'>Cancel</Text></button>
      <button className={styles.btnmain}><Text type='small'>Create Server</Text></button>
    </div>
    </>
  )
}

export default ServersPage