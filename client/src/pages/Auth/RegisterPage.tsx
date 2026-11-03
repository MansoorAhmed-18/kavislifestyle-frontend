import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BrandLogo } from '../../components/BrandLogo';
import { validateEmail, validatePhone, sanitizeEmailInput, sanitizePhoneInput } from '../../utils/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrorMsg(emailCheck.message || 'Email must be lowercase and end with @gmail.com.');
      return;
    }

    const phoneCheck = validatePhone(phone, true);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.message || 'Phone number must be strictly 10 digits.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both passwords match identical.');
      return;
    }

    const res = await signup(email, password, fullName, phone);
    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F2]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DCD3] shadow-xl text-left">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="icon" size="lg" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-[#5C554E] mt-1.5 font-medium">
              Join Kavi's Lifestyle to save your orders, manage addresses, and get exclusive offers.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Srinivasan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Email Address (must end in @gmail.com) *
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

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Mobile Number (strictly 10 digits) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Create Password (min. 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a secure password"
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

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password to confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border rounded-xl outline-none transition text-black ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#E5DCD3] focus:border-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786F66] hover:text-black transition"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword === password && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
            >
              <span>{isLoading ? 'Creating Your Account...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Existing User Callout */}
          <div className="mt-8 pt-6 border-t border-[#E5DCD3]/70 text-center">
            <p className="text-xs text-[#5C554E] font-medium">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-bold text-black hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#786F66]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted & saved securely in database</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
