import { useEffect, useRef, useState } from 'react'
import lowerFirstLetter from '../../helpers/lowerFirstLetter';
import type { TIconName } from '../../helpers/types';
import Text from '../Text';
import Icon from '../Icon/Icon';
import styles from './index.module.css'
import type { INotifyOperator } from '../../types/notifiers';
import type { IServer } from '../../types/servers';

interface Props {
    options: INotifyOperator[] | IServer[],
    name: string, 
    option: string, 
    setOption?: (value: string) => void,
    icons?: boolean
}

const Select = ({options, name, option, setOption, icons = false}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null)
    
    const camelName = lowerFirstLetter(name).replaceAll(' ', '');

    const toggleOpen = () => {
        setIsOpen(curr => !curr)
    }

    const selectOption = (newOption: string) => {
        setOption && setOption(newOption)
        setIsOpen(false)
    }


    const handleClickOutside = (e: Event) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

  return (
    <div className={styles.col}>
        <label htmlFor={camelName} className={styles.noCursor}>
            <Text type='tiny' color={5}>{name}</Text>
            <input className={styles.hide} type='text' id={camelName} name={camelName} value={option} onChange={() => {}}/>
        </label>
        <div className={styles.select} ref={selectRef}>
            <div className={styles.selectTop} onClick={toggleOpen}>
                <div className={styles.row}>
                    {icons && <Icon name={lowerFirstLetter(option) as TIconName} 
                        width={20} height={20}
                    />}
                    <Text type='tiny'>{ option }</Text>
                </div>
                <div className={styles.selectArrows}>
                    <Icon name='arrow_top' width={10} height={5}></Icon>
                    <Icon name='arrow_bottom' width={10} height={5}></Icon>
                </div>
            </div>
            {isOpen && 
                <ul className={styles.selectList}>
                    {options.map(({name}, index) => (
                        <li
                            key={index}
                            onClick={() => selectOption(name)}
                            className={`${name === option ? styles.selected : ''} `}
                        >
                            {icons && <Icon name={lowerFirstLetter(name) as TIconName} 
                                width={20} height={20}
                            />}
                            {name}
                        </li>
                    ))}
                </ul>
            }
        </div>
    </div>
  )
}

export default Select
