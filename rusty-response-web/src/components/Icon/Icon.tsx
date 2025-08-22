import { type FC } from 'react'
import type { TFontColorShape, TIconName } from '../../helpers/types'

interface Props {
    name: TIconName,
    width: number,
    height: number,
    color?: TFontColorShape
}

const Icon: FC<Props> = ({name, width, height, color}) => {
  return (
      <span style={{
        display: 'inline-block',
        width: `${width}px`,
        height: `${height}px`,
        maskImage: `url('/icons/${name}.svg')`,
        maskPosition: 'center',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        background: color ? `rgba(255, 255, 255, 0.${color})` : 'white',
        flexShrink: 0
    }}>
    </span>
  )
}

export default Icon