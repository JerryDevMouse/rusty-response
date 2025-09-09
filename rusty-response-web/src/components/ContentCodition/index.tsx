import type { IChildren } from "../../helpers/types"
interface Props extends IChildren {
    condition: boolean | unknown,
    fallback?: React.ReactNode
}

const ContentCondition: React.FC<Props> = ({
    condition,
    children,
    fallback = null
}) => {
  return condition ? children : fallback
}

export default ContentCondition