import { useCallback, useState } from 'react';
import { useAppSelector } from '../../app/store/hooks';
import { useParams } from 'react-router';
import useGetServerDataById from './useGetServerDataById';
import TabInfo from '../../pages/dashboards/servers/ServerPage/TabInfo';
import TabNotifiers from '../../pages/dashboards/servers/ServerPage/TabNotifiers';
import TabLogs from '../../pages/dashboards/servers/ServerPage/TabLogs';
import { tabs } from '../../helpers/constants';

const useServerPage = () => {
    const {id} = useParams();
    useGetServerDataById(Number(id));
    
    const [tab, setTab] = useState(tabs[0]);
    const callSetTab = useCallback((value: string) => setTab(value), [])
    const loading = useAppSelector(state => state.servers.separateServer.loading)

    const RenderTab = () => {
        if (tab === tabs[0]) return <TabInfo />
        if (tab === tabs[1]) return <TabNotifiers />
        if (tab === tabs[2]) return <TabLogs />
    }

    return {
        tab,
        setTab: callSetTab,
        loading,
        RenderTab,
        serverId: Number(id)
    }
}

export default useServerPage