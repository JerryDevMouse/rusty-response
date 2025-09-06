import useFetchNotifiers from './notifiers/useFetchNotifiers';
import useFetchServers from './servers/useFetchServers';

const useFetchData = () => {
  useFetchServers();
  useFetchNotifiers()
}

export default useFetchData