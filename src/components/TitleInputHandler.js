import { useEffect } from 'react';

export default function TitleInputHandler({ inputRef, onDone }) {
    // 1. Select the input when it becomes editable
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.select();
        } 
    }, []);
    
    // 2. Handle outside click or Enter press
    useEffect(() => {
        async function handleInteraction(event) {
            const isOutsideClick = event.type === 'mousedown' &&
                inputRef.current && !inputRef.current.contains(event.target);

            const isEnterKeyInsideInput =
                event.type === 'keydown' && event.key === 'Enter' &&
                inputRef.current && inputRef.current.contains(event.target);

            if (isOutsideClick || isEnterKeyInsideInput) {
                await onDone();
            }
        }
        document.addEventListener('mousedown', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    return null;
}