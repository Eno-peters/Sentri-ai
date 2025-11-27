import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255);
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" }).max(100);

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        toast({
          title: "Validation Error",
          description: emailValidation.error.errors[0].message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!isForgotPassword) {
        const passwordValidation = passwordSchema.safeParse(password);
        if (!passwordValidation.success) {
          toast({
            title: "Validation Error",
            description: passwordValidation.error.errors[0].message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });

        if (error) throw error;

        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for the password reset link"
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password");
          }
          throw error;
        }

        toast({
          title: "Success",
          description: "Logged in successfully"
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("This email is already registered. Please login instead.");
          }
          throw error;
        }

        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sentri ai</h1>
          <p className="text-muted-foreground mt-2">
            {isForgotPassword 
              ? "Reset your password" 
              : isLogin 
                ? "Sign in to your account" 
                : "Create a new account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              maxLength={255}
            />
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                maxLength={100}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? "Loading..." 
              : isForgotPassword 
                ? "Send Reset Link" 
                : isLogin 
                  ? "Sign In" 
                  : "Sign Up"}
          </Button>
        </form>

        <div className="space-y-2 text-center text-sm">
          {!isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          )}
          
          <div>
            <button
              type="button"
              onClick={() => setIsForgotPassword(!isForgotPassword)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isForgotPassword ? "Back to sign in" : "Forgot password?"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
