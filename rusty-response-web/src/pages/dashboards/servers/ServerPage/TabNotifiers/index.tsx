import SectionNotifiers from "./SectionNotifiers"

const TabNotifiers = () => {    
  return (
    <>
        <SectionNotifiers provider="discord" />
        <SectionNotifiers provider="telegram"/>
    </>
  )
}

export default TabNotifiers