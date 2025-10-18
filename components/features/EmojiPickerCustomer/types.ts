import { EmojiClickData } from "emoji-picker-react";

export interface EmojiPickerCustomerProps {
    onEmojiClick: (event: EmojiClickData) => void;
}