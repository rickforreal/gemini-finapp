import React from 'react';
interface SliderInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    prefix?: string;
    format?: 'number' | 'currency' | 'percent';
    helperText?: string;
}
export declare const SliderInput: React.FC<SliderInputProps>;
export {};
