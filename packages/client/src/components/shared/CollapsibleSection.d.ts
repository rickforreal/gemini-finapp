import React from 'react';
interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}
export declare const CollapsibleSection: React.FC<CollapsibleSectionProps>;
export {};
