import SectionNotifiers from "./SectionNotifiers"

const TabNotifiers = ({serverId}: {serverId: number}) => {    
  
  return (
    <>
        <SectionNotifiers provider="discord" serverId={serverId} />
        <SectionNotifiers provider="telegram" serverId={serverId}/>
    </>
  )
}

export default TabNotifiers