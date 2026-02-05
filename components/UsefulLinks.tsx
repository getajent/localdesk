'use client';

import { ExternalLink, FileText, Building2, CreditCard, Home, HeartPulse, GraduationCap } from 'lucide-react';

const links = [
    {
        title: 'Borger.dk',
        description: 'Official citizen portal',
        url: 'https://borger.dk',
        icon: Building2,
    },
    {
        title: 'SKAT',
        description: 'Tax registration & cards',
        url: 'https://skat.dk',
        icon: FileText,
    },
    {
        title: 'SIRI',
        description: 'Immigration permits',
        url: 'https://nyidanmark.dk',
        icon: CreditCard,
    },
    {
        title: 'Boligportalen',
        description: 'Find housing',
        url: 'https://www.boligportal.dk',
        icon: Home,
    },
    {
        title: 'Sundhed.dk',
        description: 'Healthcare services',
        url: 'https://sundhed.dk',
        icon: HeartPulse,
    },
    {
        title: 'SU',
        description: 'Student grants',
        url: 'https://su.dk',
        icon: GraduationCap,
    },
];

export function UsefulLinks() {
    return (
        <div className="w-full">
            <div className="mb-6">
                <span className="text-[10px] font-black tracking-[0.4em] text-danish-red uppercase">
                    Quick Links
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.title}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-5 border border-border/40 bg-card/60 hover:border-danish-red/30 hover:bg-danish-red/5 hover:shadow-sm transition-all flex items-center gap-4"
                        >
                            <div className="p-2.5 bg-muted/50 rounded-md group-hover:bg-danish-red/10 transition-colors">
                                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-danish-red transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-bold tracking-tight text-foreground">
                                        {link.title}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-danish-red/60 transition-colors" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium block">
                                    {link.description}
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
