import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BrandLogo } from '../../components/BrandLogo';
import { validateEmail, sanitizeEmailInput } from '../../utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectPath = (location.state as any)?.from || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate email: small letters and @gmail.com required
    if (!email.endsWith('@kavislifestyle.com')) {
      const emailCheck = validateEmail(email);
      if (!emailCheck.isValid) {
        setErrorMsg(emailCheck.message || 'Email must be lowercase and end with @gmail.com.');
        return;
      }
    }

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid email or password');
    } else {
      navigate(redirectPath);
    }
  };

  const handleFillDemoMansoor = () => {
    setEmail('simplysarath01@gmail.com');
    setPassword('man@123');
    setErrorMsg(null);
  };

  const handleFillDemoCustomer = () => {
    setEmail('priya@kavislifestyle.com');
    setPassword('demo123456');
    setErrorMsg(null);
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@kavislifestyle.com');
    setPassword('admin123456');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F2]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DCD3] shadow-xl text-left">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="icon" size="lg" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              Sign in to Your Account
            </h1>
            <p className="text-xs text-[#5C554E] mt-1.5 font-medium">
              Welcome back to Kavi's Lifestyle. Access your orders, addresses & wishlist.
            </p>
          </div>

          {/* Quick Demo Pre-fill Pills */}
          <div className="mb-6 p-3 bg-[#FAF6F2] rounded-2xl border border-[#E5DCD3] text-xs">
            <span className="font-bold text-black block mb-1">
              Quick Test Credentials:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleFillDemoMansoor}
                className="px-2.5 py-1 bg-white hover:bg-black hover:text-white rounded-lg border border-[#E5DCD3] font-bold text-[11px] transition text-black"
              >
                Mansoor: simplysarath01@...
              </button>
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="px-2.5 py-1 bg-white hover:bg-black hover:text-white rounded-lg border border-[#E5DCD3] font-medium text-[11px] transition"
              >
                Priya: priya@...
              </button>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="px-2.5 py-1 bg-white hover:bg-black hover:text-white rounded-lg border border-[#E5DCD3] font-medium text-[11px] transition"
              >
                Admin: admin@...
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Email Address (must end in @gmail.com)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black lowercase"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-800">
                  Account Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-[11px] font-semibold text-[#AA8222] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786F66] hover:text-black transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
            >
              <span>{isLoading ? 'Verifying Account...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* New User Callout */}
          <div className="mt-8 pt-6 border-t border-[#E5DCD3]/70 text-center">
            <p className="text-xs text-[#5C554E] font-medium">
              New to Kavi's Lifestyle?{' '}
              <Link to="/auth/register" className="font-bold text-black hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#786F66]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
