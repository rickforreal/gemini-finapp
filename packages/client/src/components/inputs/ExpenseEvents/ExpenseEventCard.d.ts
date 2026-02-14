import React from 'react';
import { ExpenseEvent } from '@shared/index';
interface ExpenseEventCardProps {
    event: ExpenseEvent;
    onUpdate: (id: string, updates: Partial<ExpenseEvent>) => void;
    onRemove: (id: string) => void;
}
export declare const ExpenseEventCard: React.FC<ExpenseEventCardProps>;
export {};
