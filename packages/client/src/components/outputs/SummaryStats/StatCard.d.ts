import React from 'react';
interface StatCardProps {
    label: string;
    value: string | number;
    type?: 'default' | 'terminal';
    isSuccess?: boolean;
}
export declare const StatCard: React.FC<StatCardProps>;
export {};
