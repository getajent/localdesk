'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const t = useTranslations('Common');

    return (
        <div
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 motion-safe:animate-fade-in"
            onClick={onClose}
        >
            <Card
                className="w-full max-w-md relative rounded-none border border-border bg-card shadow-2xl motion-safe:animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-danish-red transition-colors p-2"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <CardHeader className="p-10 pb-2 space-y-6 text-center border-b border-transparent">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-danish-red/10' : 'bg-primary/10'}`}>
                            <AlertCircle className={`h-6 w-6 ${variant === 'danger' ? 'text-danish-red' : 'text-primary'}`} />
                        </div>
                        <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${variant === 'danger' ? 'text-danish-red' : 'text-primary'}`}>
                            {t('attention')}
                        </span>
                        <CardTitle className="text-3xl font-serif font-light text-foreground">
                            {title}
                        </CardTitle>
                    </div>
                    <p className="text-muted-foreground font-sans font-light leading-relaxed max-w-xs mx-auto text-sm">
                        {description}
                    </p>
                </CardHeader>

                <CardContent className="p-10 pt-10 flex gap-4">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="flex-1 h-14 rounded-none border border-border hover:bg-muted text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className={`flex-1 h-14 rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.99] ${variant === 'danger'
                            ? 'bg-danish-red text-white hover:bg-danish-red/90'
                            : 'bg-foreground text-background btn-trend'
                            }`}
                    >
                        <span className="relative z-10">{confirmLabel}</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
