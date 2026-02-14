import React from 'react';
export interface NumericInputProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    format?: 'number' | 'currency' | 'percent';
    helperText?: string;
    disabled?: boolean;
}
export declare const NumericInput: React.FC<NumericInputProps>;
