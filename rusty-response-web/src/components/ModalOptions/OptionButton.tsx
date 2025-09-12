import Icon from '../Icon/Icon'
import Text from '../Text'
import type { TIconName } from '../../helpers/types'
interface Props {
    handleClick: VoidFunction,
    iconName?: TIconName,
    label: React.ReactNode
}

const OptionButton = ({handleClick, iconName, label}: Props) => {
  return (
    <button onClick={handleClick}>
        {iconName && <Icon name={iconName} width={10} height={10} />}
        <Text type='tiny'>{label}</Text>
    </button>
  )
}

export default OptionButton