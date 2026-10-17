import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res = await authService.login(data.email, data.password);
      login(res.access_token, res.user);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      showToast(message || "Login failed. Check your credentials.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-8 shadow-soft"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted">Sign in to your AI Finance Advisor account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
