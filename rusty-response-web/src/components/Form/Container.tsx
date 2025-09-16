import type { FC } from 'react'
import type { IChildren } from '../../types'
interface Props extends IChildren {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const Container: FC<Props> = ({children, onSubmit}) => {
  return (
    <form onSubmit={onSubmit} 
      style={{position: 'relative'}}
    >
      {children}
    </form>
  )
}

export default Container