import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || 'your email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      alert('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);

    // TODO: Verify OTP using API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    // Example after successful verification
    navigate('/login');
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
              {email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="h-12 w-11 rounded-md border border-input bg-background text-center text-lg font-semibold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? (
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
            Didn't receive the code?{' '}

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