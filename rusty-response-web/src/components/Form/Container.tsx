import type { FC } from 'react'
import type { IChildren } from '../../helpers/types'
interface Props extends IChildren {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const Container: FC<Props> = ({children, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>{children}</form>
  )
}

export default Container