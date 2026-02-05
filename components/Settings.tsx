'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { UserSettings } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Check, Loader2 } from 'lucide-react';

export function Settings() {
    const { user, userSettings, refreshSettings } = useAuth();
    const [localSettings, setLocalSettings] = useState<UserSettings>(() => userSettings || {});
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    // Track mount state
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Sync local settings when userSettings changes (but only editable fields)
    useEffect(() => {
        if (userSettings) {
            setLocalSettings(prev => ({
                ...prev,
                displayName: userSettings.displayName,
                residencyStatus: userSettings.residencyStatus,
                occupationStatus: userSettings.occupationStatus,
                hasArrived: userSettings.hasArrived,
            }));
        }
    }, [userSettings?.displayName, userSettings?.residencyStatus, userSettings?.occupationStatus, userSettings?.hasArrived]);

    const handleSave = useCallback(async () => {
        if (!user?.id) {
            console.warn('handleSave: No user ID found');
            return;
        }
        if (isSaving) {
            console.warn('handleSave: Already saving');
            return;
        }

        setIsSaving(true);
        setSaved(false);
        setError(null);

        try {
            // Only save the editable settings, preserve completedSteps from server
            const settingsToSave: UserSettings = {
                displayName: localSettings.displayName,
                residencyStatus: localSettings.residencyStatus,
                occupationStatus: localSettings.occupationStatus,
                hasArrived: localSettings.hasArrived,
                completedSteps: userSettings?.completedSteps || [],
            };

            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settingsToSave),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to save settings');
            }

            if (!isMounted.current) return;

            // Refresh settings from server
            refreshSettings().catch(console.error);
            setSaved(true);
            setTimeout(() => {
                if (isMounted.current) setSaved(false);
            }, 2000);
        } catch (err: any) {
            console.error('Error saving settings:', err);
            if (isMounted.current) {
                setError(err.message || 'An error occurred. Please try again.');
            }
        } finally {
            if (isMounted.current) {
                setIsSaving(false);
            }
        }
    }, [user?.id, isSaving, localSettings, userSettings?.completedSteps, refreshSettings]);

    // Only compare user-editable settings
    const hasChanges =
        localSettings.displayName !== userSettings?.displayName ||
        localSettings.residencyStatus !== userSettings?.residencyStatus ||
        localSettings.occupationStatus !== userSettings?.occupationStatus ||
        localSettings.hasArrived !== userSettings?.hasArrived;

    return (
        <div className="w-full border border-border/40 bg-card/70 backdrop-blur-2xl shadow-soft-xl overflow-hidden">
            {/* Header */}
            <div className="border-b border-border/40 px-8 py-5 flex justify-between items-center bg-background/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-danish-red/5">
                        <SettingsIcon className="h-4 w-4 text-danish-red" />
                    </div>
                    <div>
                        <span className="text-xs font-black tracking-[0.2em] text-foreground uppercase block">
                            Your Profile
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
                            Personalize your experience
                        </span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-8">
                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold tracking-wide">
                        {error}
                    </div>
                )}

                {/* Display Name */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase block">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={localSettings.displayName || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, displayName: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 text-sm border border-border/60 bg-background/50 focus:border-danish-red focus:ring-1 focus:ring-danish-red/20 outline-none transition-all placeholder:text-muted-foreground/40 font-medium"
                    />
                </div>

                {/* Residency Status */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase block">
                        Residency Status
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { value: 'eu_citizen', label: 'EU / EEA Citizen' },
                            { value: 'non_eu_citizen', label: 'Non-EU Citizen' },
                            { value: 'unknown', label: 'Not Sure Yet' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setLocalSettings({ ...localSettings, residencyStatus: option.value as UserSettings['residencyStatus'] })}
                                className={`px-4 py-3 text-xs font-bold tracking-wide uppercase border transition-all ${localSettings.residencyStatus === option.value
                                    ? 'border-danish-red bg-danish-red/5 text-danish-red'
                                    : 'border-border/60 text-muted-foreground hover:border-danish-red/30 hover:bg-muted/30'
                                    } text-center`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Occupation Status */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase block">
                        Current Status
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'student', label: 'Student' },
                            { value: 'employed', label: 'Employed' },
                            { value: 'self_employed', label: 'Self-Employed' },
                            { value: 'job_seeker', label: 'Job Seeker' },
                            { value: 'other', label: 'Other' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setLocalSettings({ ...localSettings, occupationStatus: option.value as UserSettings['occupationStatus'] })}
                                className={`px-3 py-3 text-[10px] font-bold tracking-wide uppercase border transition-all ${localSettings.occupationStatus === option.value
                                    ? 'border-danish-red bg-danish-red/5 text-danish-red'
                                    : 'border-border/60 text-muted-foreground hover:border-danish-red/30 hover:bg-muted/30'
                                    } ${option.value === 'other' ? 'col-span-2' : ''}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Arrival Status */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase block">
                        Are you already in Denmark?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: true, label: "Yes, I'm Here" },
                            { value: false, label: 'Planning to Move' },
                        ].map((option) => (
                            <button
                                key={String(option.value)}
                                type="button"
                                onClick={() => setLocalSettings({ ...localSettings, hasArrived: option.value })}
                                className={`px-4 py-3 text-xs font-bold tracking-wide uppercase border transition-all ${localSettings.hasArrived === option.value
                                    ? 'border-danish-red bg-danish-red/5 text-danish-red'
                                    : 'border-border/60 text-muted-foreground hover:border-danish-red/30 hover:bg-muted/30'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-border/40">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`h-12 px-8 rounded-none transition-all text-xs font-black tracking-[0.2em] uppercase ${saved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-foreground text-background btn-trend'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                <span>Saved</span>
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
