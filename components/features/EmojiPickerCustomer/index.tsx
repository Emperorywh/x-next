import { EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { EmojiPickerCustomerProps } from './types';

const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);

/**
 * 表情选择
 * @param props 
 * @returns 
 */
export function EmojiPickerCustomer(props: EmojiPickerCustomerProps) {
    const { onEmojiClick } = props;
    const handleEmojiClick = (event: EmojiClickData) => {
        onEmojiClick?.(event);
    }

    return <Picker onEmojiClick={handleEmojiClick} />
}