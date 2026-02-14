import React from 'react';
import { IncomeStream } from '@shared/index';
interface IncomeEventCardProps {
    event: IncomeStream;
    onUpdate: (id: string, updates: Partial<IncomeStream>) => void;
    onRemove: (id: string) => void;
}
export declare const IncomeEventCard: React.FC<IncomeEventCardProps>;
export {};
