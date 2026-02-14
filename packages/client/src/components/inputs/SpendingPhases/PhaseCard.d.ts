import React from 'react';
import { SpendingPhase } from '../../../store/slices/spendingPhases';
interface PhaseCardProps {
    phase: SpendingPhase;
    index: number;
    onUpdate: (id: string, updates: Partial<SpendingPhase>) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
    isLast: boolean;
}
export declare const PhaseCard: React.FC<PhaseCardProps>;
export {};
