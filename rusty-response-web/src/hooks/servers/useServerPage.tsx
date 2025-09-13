import { useCallback, useState } from 'react';
import { useAppSelector } from '../../app/store/hooks';
import { useParams } from 'react-router';
import useGetServerDataById from './useGetServerDataById';
import TabInfo from '../../pages/dashboards/servers/ServerPage/TabInfo';
import TabNotifiers from '../../pages/dashboards/servers/ServerPage/TabNotifiers';
import TabLogs from '../../pages/dashboards/servers/ServerPage/TabLogs';
import { serverPageTabs } from '../../constants/text';

const useServerPage = () => {
    const {id} = useParams();
    useGetServerDataById(Number(id));
    
    const [tab, setTab] = useState(serverPageTabs[0]);
    const callSetTab = useCallback((value: string) => setTab(value), [])
    const loading = useAppSelector(state => state.servers.separateServer.loading)

    const RenderTab = () => {
        if (tab === serverPageTabs[0]) return <TabInfo />
        if (tab === serverPageTabs[1]) return <TabNotifiers />
        if (tab === serverPageTabs[2]) return <TabLogs />
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