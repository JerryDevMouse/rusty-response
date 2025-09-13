import type { FC } from 'react'
import type { IChildren } from '../../types'
import { fontSizeCategories } from '../../constants/styles'
import styles from './index.module.css'
import type { TFontColorShape, TFontSize } from '../../types/ui'

interface Props extends IChildren {
    weight?: 400 | 500 | 600,
    type: TFontSize,
    color?: TFontColorShape,
    mbottom?: number
}

const Text: FC<Props> = ({children, weight, type, color, mbottom}) => {
  return (
    <p
      className={styles.text}
      style={{
          fontWeight: weight ?? '',
          fontSize: fontSizeCategories[type] + 'rem',
          color: color ? `rgba(255, 255, 255, 0.${color})` : '',
          marginBottom: mbottom ? `${mbottom / 16}rem` : ''
      }}
    >
      {children}
    </p>
  )
}

export default Text