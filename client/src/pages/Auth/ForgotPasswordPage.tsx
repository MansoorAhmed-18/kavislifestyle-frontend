import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { validateEmail, sanitizeEmailInput } from '../../utils/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrorMsg(emailCheck.message || 'Email must be lowercase and end with @gmail.com.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#114B5F] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          <h1 className="text-2xl font-bold text-[#114B5F]">Reset Password</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Enter the email address associated with your account, and we'll send you instructions to reset your password.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-800">Password Reset Email Sent</h3>
              <p className="text-xs text-emerald-700">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address (must end in @gmail.com)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-[#114B5F] transition lowercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F26B4F] hover:bg-[#D95337] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
