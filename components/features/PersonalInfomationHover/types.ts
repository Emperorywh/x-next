import { User } from "@/lib/api/user/user.types";

export interface PersonalInfomationHoverProps {
    user: User;
    children: React.ReactNode;
}