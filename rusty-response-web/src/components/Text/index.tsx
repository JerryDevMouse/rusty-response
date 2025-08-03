import type { FC } from 'react'
import { fontSizeCategories } from '../../helpers/constants'
import type { IChildren, TFontColorShape, TFontSize } from '../../helpers/types'
import styles from './index.module.css'

interface Props extends IChildren {
    weight?: 400 | 500 | 600,
    type: TFontSize,
    color?: TFontColorShape
}

const Text: FC<Props> = ({children, weight, type, color}) => {
  return (
    <p
        className={styles.text}
        style={{
            fontWeight: weight ?? '',
            fontSize: fontSizeCategories[type] + 'rem',
            color: color ? `rgba(255, 255, 255, 0.${color})` : ''
        }}
    >
        {children}
    </p>
  )
}

export default Text