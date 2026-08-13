import { Link, useNavigate } from "react-router-dom";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLoginMutation } from "@/lib/api/authApi";
import { cookieUtils } from "@/lib/utils/cookies";
import { setUser } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { store } from "@/lib/store/store";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user types
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   setErrorMessage("");

  //   try {
  //     const response = await login({
  //       email: formData.email,
  //       password: formData.password,
  //     }).unwrap();

  //     console.log("Login successful:", response);

  //     // Login successful
  //     navigate("/admin", { replace: true });
  //   } catch (error: any) {
  //     console.error("Login failed:", error);

  //     const message =
  //       error?.data?.message ||
  //       error?.message ||
  //       "Login failed.";

  //     setErrorMessage(message);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

     

      // ✅ Save tokens from response
      if (response?.data?.accessToken) {
        cookieUtils.setAccessToken(response.data.accessToken);
      }

      if (response?.data?.refreshToken) {
        cookieUtils.setRefreshToken(response.data.refreshToken);
      }

      if (response?.data?.user) {
        cookieUtils.setUser(response.data.user);
        dispatch(setUser(response.data.user));
      }


      navigate("/admin", { replace: true });
    } catch (error: any) {
      const message =
        error?.data?.message || "Invalid email or password. Please try again.";
      setErrorMessage(message);
    }
  };
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>

          <CardDescription>Login to your CampusEcho account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
