import useTextArea from "../../hooks/TextArea/useTextArea";
import Text from "../Text";
import styles from './index.module.css'

interface Props {
    name: string,
    defaultValue?: string
}

const TextArea = ({name, defaultValue = ''}: Props) => {
    const {value, textareaRef, camelName, 
        applySuggestion, handleChange, handleKeyDown, popupPos,
        suggestions, selectedIndex, setSelectedIndex
    } = useTextArea(name, defaultValue);

  return (
    <div className={styles.col}>
        <label htmlFor={camelName}>
            <Text type='tiny' color={5}>{name}</Text>
        </label>
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            name={camelName}
            placeholder="For example: server: {{server.name}}"
        />
        {popupPos && suggestions.length > 0 && (
        <ul
            className={styles.popup}
            style={{ bottom: popupPos.top - 10, left: popupPos.left + 30 }}
        >
            {suggestions.map((sug, i) => (
                <li
                    key={sug.full}
                    className={i === selectedIndex ? styles.active : ""}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        applySuggestion(sug);
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                >
                    {sug.value}
                </li>
            ))}
        </ul>
        )}
    </div>
  );
};

export default TextArea;
