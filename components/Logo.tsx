'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface LogoProps {
    className?: string;
    light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = () => {
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/');
        }
    };

    return (
        <div
            className={cn("flex items-center gap-0 group cursor-pointer select-none", className)}
            onClick={handleClick}
        >
            <div className={cn(
                "flex flex-col items-start transition-all duration-300",
                light ? "text-background dark:text-foreground" : "text-foreground"
            )}>
                <div className="flex items-baseline gap-1.5 overflow-hidden">
                    <span className="font-serif italic text-2xl lg:text-3xl tracking-tighter leading-none motion-safe:group-hover:-translate-y-[2px] transition-transform duration-500">
                        Local
                    </span>
                    <span className="font-sans font-black text-xl lg:text-2xl tracking-[0.2em] uppercase leading-none opacity-90">
                        Desk
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-danish-red mb-1 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100" />
                </div>

                <div className="flex items-center gap-2 mt-1 w-full">
                    <div className="h-[1px] flex-1 bg-border/60 group-hover:bg-danish-red/40 transition-colors duration-500" />
                    <span className="font-sans text-[8px] font-bold tracking-[0.8em] uppercase text-muted-foreground/60 group-hover:text-danish-red transition-colors duration-500">
                        Denmark
                    </span>
                </div>
            </div>
        </div>
    );
}
