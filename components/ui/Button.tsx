import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant: "primary" | "secondary";
}

const Button = ({ children, variant, type = "button", className = "", ...props }: ButtonProps) => {
    // Primary is the high-contrast action, Secondary is the subtle action
    const styles = variant === "primary"
        ? "bg-accent text-primary shadow-sm"
        : "bg-secondary text-accent border border-neutral/10";

    return (
        <button
            className={`px-8 py-3 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-label font-medium ${styles} ${className}`}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;