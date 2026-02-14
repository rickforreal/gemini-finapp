import React from 'react';
interface MonthYearPickerProps {
    label?: string;
    month: number;
    year: number;
    onChange: (date: {
        month: number;
        year: number;
    }) => void;
    className?: string;
}
export declare const MonthYearPicker: React.FC<MonthYearPickerProps>;
export {};
