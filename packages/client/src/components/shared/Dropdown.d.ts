interface DropdownOption<T> {
    label: string;
    value: T;
    tag?: string;
    tagColor?: string;
}
interface DropdownProps<T> {
    label?: string;
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}
export declare const Dropdown: <T extends string | number>({ label, options, value, onChange, className, }: DropdownProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
