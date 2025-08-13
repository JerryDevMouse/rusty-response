// import NoServers from '../../components/NoServers'
import styles from './index.module.css'

import Text from "../../components/Text"

const ServersPage = () => {
  return (
    // <NoServers text='To get started, add your first server'/>
    <>
    <div className={styles.title}>
      <Text type="xl" weight={600}>Create Server</Text>
    </div>
    <section className={styles.section}>
      <Text type="small" weight={600}>Server Information</Text>
      <div className={styles.block}>
        <div className={styles.row}>
          <div className={styles.col}>
            <label htmlFor="serverName">
              <Text type='tiny' color={5}>Server Name</Text>
            </label>
            <input type="text" id='serverName' placeholder='Enter Server Name'/>
          </div>
          <div className={styles.col}>
            <label htmlFor="serverURL">
              <Text type='tiny' color={5}>URL</Text>
            </label>
            <input type="text" id='serverURL' placeholder='Enter Server URL'/>
          </div>
        </div>
      </div>
    </section>
    <section className={styles.section}>
      <Text type="small" weight={600}>Monitoring Settings</Text>
      <div className={styles.block}>
        <div className={styles.row}>
          <div className={styles.col}>
            <label htmlFor="serverTimeout">
              <Text type='tiny' color={5}>Timeout</Text>
              <div className={styles.help}>
                <div className={styles.icon}>i</div>
                <div className={styles.helpcontent}>
                  <Text type='tiny' weight={600}>Timeout</Text>
                  <Text type='tiny'>The interval between server checks (seconds)</Text>
                </div>
              </div>
            </label>
            <div className={styles.rowinput}>
              <input type="number" id='serverTimeout' defaultValue={10} placeholder='Enter Server Timeout'/>
              <Text type='tiny'>seconds</Text>
            </div>

          </div>
          <div className={styles.col}>
            <label htmlFor="serverInterval">
              <Text type='tiny' color={5}>Interval</Text>
              <div className={styles.help}>
                <div className={styles.icon}>i</div>
                <div className={styles.helpcontent}>
                  <Text type='tiny' weight={600}>Interval</Text>
                  <Text type='tiny'>The interval between server checks (seconds)</Text>
                </div>
              </div>
            </label>
            <div className={styles.rowinput}>
              <input type="number" id='serverInterval' defaultValue={60} placeholder='Enter Server Interval'/>
              <Text type='tiny'>seconds</Text>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div className={styles.btns}>
      <button className={styles.btn}><Text type='small'>Cancel</Text></button>
      <button className={styles.btnmain}><Text type='small'>Create Server</Text></button>
    </div>
    </>
  )
}

export default ServersPage