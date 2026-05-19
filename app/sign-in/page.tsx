"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import CustomInput from "@/components/ui/CustomInput";
import { ArrowRight } from "lucide-react";

const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Invalid credentials.");
                setLoading(false);
                return;
            }

            // Redirect to dashboard on success
            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-1px)] p-6 bg-primary">
            <div className="bg-secondary/40 p-8 md:p-14 border border-border rounded-2xl shadow-sm w-full max-w-md animate-in fade-in duration-500">
                <h2 className="font-newsreader text-4xl text-center">Sign In</h2>
                <p className="text-text-muted pt-3 text-center font-label uppercase tracking-widest text-xs">Portfolio Admin</p>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="pt-6 flex flex-col gap-6">
                    <CustomInput
                        type="email"
                        label="Email Address"
                        variant="primary"
                        placeholder="johndoe@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <CustomInput
                        type="password"
                        label="Password"
                        variant="primary"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2"
                    >
                        {loading ? "Signing In..." : "Sign In"} <ArrowRight size={18} />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;