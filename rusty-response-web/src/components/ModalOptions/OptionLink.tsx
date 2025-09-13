import { Link } from 'react-router'
import Icon from '../Icon/Icon'
import Text from '../Text'
import type { TIconName } from '../../types/ui'
interface Props {
    to: string,
    iconName?: TIconName,
    label: React.ReactNode

}
const OptionLink = ({to, iconName, label}: Props) => {
  return (
    <Link to={to}>
        {iconName && <Icon name={iconName} width={10} height={10} />}
        <Text type='tiny'>{label}</Text>
    </Link>
  )
}

export default OptionLink