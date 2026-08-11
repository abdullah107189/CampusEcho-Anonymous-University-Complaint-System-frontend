import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

export default function ResendOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // TODO: Call resend OTP API here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    navigate('/verify-otp', {
      state: {
        email,
      },
    });
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
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? (
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
            Remember your account?{' '}

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