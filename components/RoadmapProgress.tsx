'use client';

import { useAuth } from '@/components/AuthProvider';
import { updateUserSettings } from '@/lib/supabase';
import { MapPin, FileCheck, Home, Briefcase, CreditCard, Heart, Lock, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'completed' | 'current' | 'upcoming' | 'locked';
    lockedReason?: string;
}

function getRoadmapSteps(settings: {
    residencyStatus?: string;
    occupationStatus?: string;
    hasArrived?: boolean;
    completedSteps?: string[];
    roadmapModifications?: {
        hiddenStepIds?: string[];
    };
}): RoadmapStep[] {
    const { residencyStatus, occupationStatus, hasArrived, completedSteps = [], roadmapModifications } = settings;
    const isEU = residencyStatus === 'eu_citizen';
    const isNonEU = residencyStatus === 'non_eu_citizen';
    const isStudent = occupationStatus === 'student';

    // Explicitly check for hidden steps
    const hiddenStepIds = roadmapModifications?.hiddenStepIds || [];

    // Determine completed steps based on settings and manual completions
    const hasProfile = !!residencyStatus && residencyStatus !== 'unknown';

    // Helper to check if step is completed
    const isCompleted = (stepId: string) => completedSteps.includes(stepId);

    // Find current step (first non-completed, non-locked step)
    const stepDefinitions = [
        { id: 'profile', baseCompleted: hasProfile },
        { id: 'visa', baseCompleted: hasArrived || isCompleted('visa'), locked: !hasProfile },
        { id: 'cpr', baseCompleted: isCompleted('cpr'), locked: !hasProfile },
        { id: 'housing', baseCompleted: isCompleted('housing'), locked: !hasProfile },
        { id: 'work', baseCompleted: isCompleted('work'), locked: !hasProfile || (isNonEU && !hasArrived && !isCompleted('visa')) },
        { id: 'health', baseCompleted: isCompleted('health'), locked: !hasProfile },
    ].filter(def => !hiddenStepIds.includes(def.id));

    // Calculate which step should be "current"
    let foundCurrent = false;
    const stepStatuses: Record<string, 'completed' | 'current' | 'upcoming' | 'locked'> = {};

    for (const def of stepDefinitions) {
        if (def.locked) {
            stepStatuses[def.id] = 'locked';
        } else if (def.baseCompleted || isCompleted(def.id)) {
            stepStatuses[def.id] = 'completed';
        } else if (!foundCurrent) {
            stepStatuses[def.id] = 'current';
            foundCurrent = true;
        } else {
            stepStatuses[def.id] = 'upcoming';
        }
    }

    const allSteps: RoadmapStep[] = [
        {
            id: 'profile',
            title: 'Set Up Profile',
            description: 'Define your residency and occupation status',
            icon: FileCheck,
            status: stepStatuses['profile'],
        },
        {
            id: 'visa',
            title: isEU ? 'EU Registration' : 'Visa & Work Permit',
            description: isEU
                ? 'Register with Danish authorities as EU citizen'
                : 'Apply for the appropriate visa or work permit',
            icon: MapPin,
            status: stepStatuses['visa'],
            lockedReason: !hasProfile ? 'Complete your profile first' : undefined,
        },
        {
            id: 'cpr',
            title: 'CPR Number',
            description: 'Get your Danish personal identification number',
            icon: CreditCard,
            status: stepStatuses['cpr'],
            lockedReason: !hasProfile ? 'Complete your profile first' : undefined,
        },
        {
            id: 'housing',
            title: 'Find Housing',
            description: 'Search for accommodation in Denmark',
            icon: Home,
            status: stepStatuses['housing'],
            lockedReason: !hasProfile ? 'Complete your profile first' : undefined,
        },
        {
            id: 'work',
            title: isStudent ? 'University Enrollment' : 'Employment',
            description: isStudent
                ? 'Complete university registration and SU application'
                : 'Start your job or set up your business',
            icon: Briefcase,
            status: stepStatuses['work'],
            lockedReason: !hasProfile
                ? 'Complete your profile first'
                : isNonEU && !hasArrived && !isCompleted('visa')
                    ? 'Requires valid visa/work permit'
                    : undefined,
        },
        {
            id: 'health',
            title: 'Healthcare & Insurance',
            description: 'Register for Danish healthcare system',
            icon: Heart,
            status: stepStatuses['health'],
            lockedReason: !hasProfile ? 'Requires CPR number' : undefined,
        },
    ];

    return allSteps.filter(step => !hiddenStepIds.includes(step.id));
}

interface StepCardProps {
    step: RoadmapStep;
    isLast: boolean;
    onStepClick?: (stepId: string, title: string) => void;
}

function StepCard({ step, isLast, onStepClick }: StepCardProps) {
    const Icon = step.icon;
    const canClick = step.status !== 'locked';

    const statusStyles = {
        completed: 'opacity-90',
        current: 'opacity-100',
        upcoming: 'opacity-60',
        locked: 'opacity-30',
    };

    const iconStyles = {
        completed: 'text-emerald-500 bg-emerald-500/10',
        current: 'text-white bg-danish-red shadow-xl shadow-danish-red/30',
        upcoming: 'text-muted-foreground/50 bg-secondary/50',
        locked: 'text-muted-foreground/40 bg-secondary/30',
    };

    const handleClick = () => {
        if (canClick && onStepClick) {
            onStepClick(step.id, step.title);
        }
    };

    return (
        <div className="relative group/step">
            <div
                className={`
                    py-10 flex items-start gap-10 transition-all duration-500
                    ${statusStyles[step.status]}
                    ${canClick ? 'cursor-pointer hover:translate-x-1' : ''}
                `}
                onClick={handleClick}
                role={canClick ? 'button' : undefined}
                tabIndex={canClick ? 0 : undefined}
                onKeyDown={(e) => {
                    if (canClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                {/* Icon Column */}
                <div className="relative z-10 flex flex-col items-center shrink-0">
                    <div className={`
                        w-14 h-14 flex items-center justify-center transition-all duration-500 rounded-none border border-border/10
                        ${iconStyles[step.status]}
                    `}>
                        {step.status === 'completed' ? (
                            <Check className="h-6 w-6 stroke-[3px]" />
                        ) : step.status === 'locked' ? (
                            <Lock className="h-5 w-5 opacity-40" />
                        ) : (
                            <Icon className={`h-6 w-6 ${step.status === 'current' ? 'animate-in zoom-in-75 duration-500' : ''}`} />
                        )}
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 pt-1.5">
                    <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-black tracking-[0.3em] uppercase transition-colors ${step.status === 'current' ? 'text-danish-red' : 'text-muted-foreground/40'}`}>
                                {step.status === 'completed' ? 'Success' : step.status === 'current' ? 'Next Action' : 'Upcoming'}
                            </span>
                            {step.status === 'current' && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-danish-red animate-ping" />
                                    <span className="text-[9px] font-black tracking-[0.2em] text-danish-red uppercase">Live</span>
                                </div>
                            )}
                        </div>
                        <h4 className={`text-lg font-bold tracking-tight transition-colors ${step.status === 'current' ? 'text-foreground' : 'text-foreground/70'}`}>
                            {step.title}
                        </h4>
                    </div>
                    <p className={`text-[14px] leading-relaxed transition-colors duration-500 ${step.status === 'current' ? 'text-muted-foreground' : 'text-muted-foreground/60'} font-medium`}>
                        {step.status === 'locked' && step.lockedReason
                            ? step.lockedReason
                            : step.description}
                    </p>
                </div>
            </div>

            {/* Vertical Connector */}
            {!isLast && (
                <div className={`absolute left-7 top-24 bottom-0 w-[1px] -translate-x-1/2 transition-colors duration-1000 ${step.status === 'completed' ? 'bg-emerald-500/40' : 'bg-border/20'}`} />
            )}
        </div>
    );
}

export function RoadmapProgress({ onStepClick }: { onStepClick?: (stepId: string, title: string) => void }) {
    const { userSettings } = useAuth();

    const steps = getRoadmapSteps({
        residencyStatus: userSettings?.residencyStatus,
        occupationStatus: userSettings?.occupationStatus,
        hasArrived: userSettings?.hasArrived,
        completedSteps: userSettings?.completedSteps,
        roadmapModifications: userSettings?.roadmapModifications,
    });



    const completedCount = steps.filter(s => s.status === 'completed').length;
    const totalSteps = steps.length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    return (
        <div className="w-full space-y-12">
            {/* Header */}
            <div className="flex justify-between items-start gap-6">
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-danish-red/30" />
                        <span className="text-[11px] font-black tracking-[0.3em] text-danish-red uppercase">
                            Your Journey
                        </span>
                    </div>
                    <h2 className="text-5xl font-serif font-medium text-foreground tracking-tight leading-none">
                        Roadmap
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[300px]">
                        Personalized step-by-step guidance for your relocation and life in Denmark.
                    </p>
                </div>
                <div className="text-right pt-2">
                    <span className="text-6xl font-serif font-medium text-foreground tracking-tighter">{progressPercent}%</span>
                    <span className="text-[11px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase block mt-2">
                        Complete
                    </span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-5">
                <div className="h-[2px] w-full bg-muted/30 overflow-hidden">
                    <div
                        className="h-full bg-danish-red transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(200,16,46,0.3)]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black tracking-[0.15em] text-muted-foreground/60 uppercase">
                        {completedCount} of {totalSteps} Milestone{totalSteps !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold tracking-[0.1em] text-foreground/80 lowercase italic">
                            live progress
                        </span>
                    </div>
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <StepCard
                        key={step.id}
                        step={step}
                        isLast={index === steps.length - 1}
                        onStepClick={onStepClick}
                    />
                ))}
            </div>

            {/* Help Hint */}
            <div className="pt-8 border-t border-border/10">
                <p className="text-[11px] font-medium text-muted-foreground/40 text-center leading-relaxed italic">
                    Click any milestone for detailed guidance<br />from your Denmark assistant
                </p>
            </div>
        </div>
    );
}
