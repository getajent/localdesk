'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Map, Settings as SettingsIcon } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
}

const tabs: Tab[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface DashboardTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    useEffect(() => {
        const activeRef = tabRefs.current[activeTab];
        if (activeRef) {
            setIndicatorStyle({
                left: activeRef.offsetLeft,
                width: activeRef.offsetWidth,
            });
        }
    }, [activeTab]);

    return (
        <div className="relative">
            {/* Tab Container */}
            <div className="flex border border-border/40 bg-card/70 backdrop-blur-2xl overflow-hidden">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                relative flex-1 flex items-center justify-center gap-2 px-6 py-4
                transition-all duration-300 ease-out
                ${isActive
                                    ? 'text-danish-red'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                }
              `}
                            aria-selected={isActive}
                            role="tab"
                        >
                            <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                            <span className={`
                text-[10px] font-black tracking-[0.2em] uppercase
                transition-all duration-300
                ${isActive ? 'opacity-100' : 'opacity-70'}
              `}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Animated Indicator */}
            <div
                className="absolute bottom-0 h-[3px] bg-danish-red transition-all duration-300 ease-out"
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
            />
        </div>
    );
}
