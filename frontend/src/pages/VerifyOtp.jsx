import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, loading } = useAuth();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await verifyOtp(email, otp);
    if (res.success) {
      navigate('/');
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    const res = await resendOtp(email);
    if (res.success) {
      setCooldown(60);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Verify Your Email</h1>
          <p className="text-slate-500 text-xs">
            We sent a 6-digit verification code to <strong className="text-slate-800">{email || 'your email'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!location.state?.email && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              placeholder="e.g. 123456"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300"
          >
            {loading ? (
              'Verifying Code...'
            ) : (
              <>
                Confirm Verification <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col items-center space-y-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Didn't receive code? Check spam folder or</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || loading || !email}
              className="font-bold text-blue-600 hover:underline flex items-center gap-1 disabled:text-slate-400 disabled:no-underline"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
            </button>
          </div>

          <div>
            <Link to="/login" className="font-bold text-slate-500 hover:text-slate-800">
              Return to Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
