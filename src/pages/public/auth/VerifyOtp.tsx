import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useVerifyOTPMutation } from "@/lib/api/authApi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();

  // Handle typing + paste
  const handleChange = (value: string, index: number) => {
    // Only allow numbers
    const numbersOnly = value.replace(/\D/g, "");

    if (!numbersOnly) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // If user pastes multiple digits
    if (numbersOnly.length > 1) {
      const pastedOtp = numbersOnly.slice(0, 6).split("");

      const newOtp = ["", "", "", "", "", ""];

      pastedOtp.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setOtp(newOtp);

      // Focus last filled input
      const lastIndex = Math.min(pastedOtp.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

      return;
    }

    // Normal single digit typing
    const newOtp = [...otp];
    newOtp[index] = numbersOnly[0];

    setOtp(newOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    // Arrow left
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Arrow right
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP.");
      return;
    }

    if (!email) {
      setErrorMessage("Email not found. Please go back and register again.");
      return;
    }

    try {
      const response = await verifyOTP({
        email,
        otp: otpCode,
      }).unwrap();

      console.log("OTP verification successful:", response);

      // OTP successfully verified
      navigate("/login");
    } catch (error: any) {
      console.error("OTP verification failed:", error);

      const message =
        error?.data?.message ||
        error?.message ||
        "Invalid or expired OTP. Please try again.";

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">
            Verify your email
          </CardTitle>

          <CardDescription className="leading-relaxed">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">
              {email || "your email"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="h-12 w-11 rounded-md border border-input bg-background text-center text-lg font-semibold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}

            {/* Verify Button */}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Link
              to="/resend-otp"
              state={{ email }}
              className="font-medium text-primary hover:underline"
            >
              Resend OTP
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
