import type { IChildren } from '../../helpers/types'

const Container = ({children}: IChildren) => {
  return (
    <form>{children}</form>
  )
}

export default Container