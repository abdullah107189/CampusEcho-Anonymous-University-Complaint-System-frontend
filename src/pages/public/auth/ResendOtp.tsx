import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useResendOTPMutation } from "@/lib/api/authApi";

export default function ResendOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [errorMessage, setErrorMessage] = useState("");

  const [resendOTP, { isLoading }] = useResendOTPMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      const response = await resendOTP({
        email,
      }).unwrap();

      console.log("OTP resent successfully:", response);

      // OTP successfully sent
      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error: any) {
      console.error("Resend OTP failed:", error);

      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-3xl font-bold">
            Resend OTP
          </CardTitle>

          <CardDescription>
            Enter your email address and we'll send you a new
            verification code.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                required
              />
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-center text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your account?{" "}

            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}