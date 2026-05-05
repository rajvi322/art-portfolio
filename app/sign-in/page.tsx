import Button from "@/components/ui/Button";
import CustomInput from "@/components/ui/CustomInput";
import { ArrowRight } from "lucide-react";

const SignInPage = () => {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-1px)]">
            <div className="bg-secondary p-14 border border-border">
                <h2 className="font-newsreader text-4xl text-center">Sign In</h2>
                <p className="text-text-muted pt-3 text-center">Portfolio Admin</p>
                <form className="pt-6 flex flex-col gap-6">
                    <CustomInput type="email" label="Email Address" variant="primary" placeholder="admin@artegallery.com" />
                    <CustomInput type="password" label="Password" variant="primary" placeholder="••••••••" />
                    <Button variant="primary" type="submit">Sign In <ArrowRight /></Button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;