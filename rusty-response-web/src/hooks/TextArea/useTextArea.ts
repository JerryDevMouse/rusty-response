import React, { useCallback, useRef, useState } from 'react'
import lowerFirstLetter from '../../helpers/lowerFirstLetter';
import useSuggestions from './useSuggestions';

const useTextArea = (name: string, defaultValue = '') => {
    const camelName = lowerFirstLetter(name).replaceAll(' ', '');
    const [value, setValue] = useState(defaultValue);
    const callSetValue = useCallback((value: string) => setValue(value), [])
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { applySuggestion, updateSuggestions, 
        handleKeyDown, popupPos, suggestions, selectedIndex, setSelectedIndex} = useSuggestions(value, callSetValue, textareaRef)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        updateSuggestions(e.target);
    };

  return {
    value, camelName, textareaRef, handleChange, 
    applySuggestion, handleKeyDown, popupPos,
    suggestions, selectedIndex, setSelectedIndex 
}
}

export default useTextArea