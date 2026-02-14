import React from 'react';
interface ToggleSwitchProps {
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    helperText?: string;
}
export declare const ToggleSwitch: React.FC<ToggleSwitchProps>;
export {};
