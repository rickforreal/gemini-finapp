import React from 'react';
interface SegmentedToggleOption<T> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}
interface SegmentedToggleProps<T> {
    options: SegmentedToggleOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}
export declare const SegmentedToggle: <T extends string | number>({ options, value, onChange, className, size, }: SegmentedToggleProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
