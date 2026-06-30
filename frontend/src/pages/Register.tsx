import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const res = await authService.register(data.email, data.full_name, data.password);
      login(res.access_token, res.user);
      showToast("Account created — welcome aboard!", "success");
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      showToast(message || "Registration failed. Please try again.", "error");
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
          <h1 className="text-xl font-semibold text-white">Create your account</h1>
          <p className="text-sm text-muted">Start tracking and chatting with your AI finance advisor</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Full Name"
            placeholder="Jane Doe"
            error={errors.full_name?.message}
            {...register("full_name", { required: "Full name is required" })}
          />
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
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
