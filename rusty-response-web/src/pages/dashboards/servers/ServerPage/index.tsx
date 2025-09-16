import Loading from "../../../../components/Loading"
import TabsNav from "./TabsNav"
import useServerPage from "../../../../hooks/servers/useServerPage"

const ServerPage = () => {
    const {loading, tab, setTab, RenderTab, serverId} = useServerPage()

  return (
    <>
        <TabsNav tab={tab} setTab={setTab} serverId={serverId}/>
        <Loading.ConditionalLoader
            isLoading={loading}
            loader={<Loading.Basic />}
        >
            <RenderTab />        
        </Loading.ConditionalLoader>
    </>
  )
}

export default ServerPage