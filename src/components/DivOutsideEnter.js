import { useEffect } from 'react';

export default function DivOutsideEnter({ DivRef, onDone }) {
    useEffect(() => {
        const handleClick = (e) => {
            if (DivRef.current && !DivRef.current.contains(e.target)) {
                onDone('clickOutside');
            }
        };

        const handleKey = (e) => {
            if (e.key === 'Enter') {
                onDone('enter');
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return null;
}