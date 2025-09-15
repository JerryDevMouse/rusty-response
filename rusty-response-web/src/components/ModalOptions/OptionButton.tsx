import type { TIconName } from '../../types/ui'
import Icon from '../Icon/Icon'
import Text from '../Text'
interface Props {
    handleClick: VoidFunction,
    iconName?: TIconName,
    label: React.ReactNode
}

const OptionButton = ({handleClick, iconName, label}: Props) => {
  return (
    <button onClick={handleClick} type='button'>
        {iconName && <Icon name={iconName} width={10} height={10} />}
        <Text type='tiny'>{label}</Text>
    </button>
  )
}

export default OptionButton