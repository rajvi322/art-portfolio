interface ButtonProps {
    children: React.ReactNode;
    variant: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}


const Button = ({ children, variant, type, onClick }: ButtonProps) => {
    // Primary is the high-contrast action, Secondary is the subtle action
    const styles = variant === "primary"
        ? "bg-accent text-primary shadow-sm"
        : "bg-secondary text-accent border border-neutral/10";

    return (
        <button
            className={`px-8 py-3 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-label font-medium ${styles}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}

export default Button;