interface CustomInputProps {
    label?: string;
    variant: "primary" | "secondary";
    type?: "text" | "password" | "email" | "number";
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    [key: string]: unknown;
}

const CustomInput = ({ label, variant, type, placeholder, value, onChange, error, ...props }: CustomInputProps) => {
    return (
        <div className="flex flex-col gap-2 relative">
            {variant === "primary" && <label className="text-label font-semibold tracking-wider uppercase left-4 top-2 text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs transition-all duration-300">{label}</label>}
            <input type={type} className={`peer border border-border w-full px-4 py-3 placeholder:text-text-muted/50 bg-transparent placeholder-transparent focus:border-accent focus:outline-none transition-colors duration-300 ${error ? "border-error" : ""}`} placeholder={placeholder} value={value} onChange={onChange} {...props} />
            {error && <p className="text-error text-sm">{error}</p>}
        </div>);
};

export default CustomInput;