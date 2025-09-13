import { type FC } from 'react'
import type { TFontColorShape, TIconName } from '../../types/ui';

interface Props {
    name: TIconName,
    width: number,
    height?: number,
    color?: TFontColorShape
}
const COLORED_ICONS = new Set(['telegram', 'bitrix', 'discord']);

const Icon: FC<Props> = ({name, width, height, color}) => {
  const isColored = COLORED_ICONS.has(name);
  if (isColored) {
      return (
        <img 
          src={`/icons/${name}.svg`}
          width={width}
          height={height ?? width}
          alt={`icon ${name}`}
          style={{
            display: 'inline-block',
            flexShrink: 0
          }}
        >
      </img>
    )
  }
  return (
      <span style={{
        display: 'inline-block',
        width: `${width}px`,
        height: `${height ?? width}px`,
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