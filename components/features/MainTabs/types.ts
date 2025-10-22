export interface MainTabsProps {
    items: {
        key: string;
        label: string;
        children: React.ReactNode
    }[],
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (activeKey: string) => void;
}