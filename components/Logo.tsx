'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface LogoProps {
    className?: string;
    light?: boolean; // For use on dark backgrounds
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
            className={cn("flex items-center gap-3 group cursor-pointer select-none", className)}
            onClick={handleClick}
        >
            {/* Architectural Anchor */}
            <div className="w-3.5 h-3.5 bg-danish-red transform rotate-45 group-hover:rotate-0 transition-transform duration-300 shadow-sm translate-y-[1px]" />

            <div className={cn(
                "text-2xl tracking-tighter uppercase leading-none flex items-baseline",
                light ? "text-white" : "text-slate-950"
            )}>
                <span className="font-black">Local</span>
                <span className="font-medium opacity-80">Desk</span>
                <span className="text-danish-red font-black mx-1.5 mb-[1px]">/</span>
                <span className="font-black relative">
                    DK
                    <span className={cn(
                        "absolute -bottom-1 left-0 w-full h-[3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-danish-red"
                    )}></span>
                </span>
            </div>
        </div>
    );
}
