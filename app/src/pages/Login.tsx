/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Mail, Lock, Building2 } from 'lucide-react';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('admin@encoderbytes.com');
//   const [password, setPassword] = useState('admin123');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, error } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch {
//       // Error is handled by auth context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5d88c6]/10 to-[#5d88c6]/5 p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#5d88c6] mb-4">
//             <Building2 className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">EncoderBytes</h1>
//           <p className="text-gray-500 mt-2">Enterprise Resource Planning</p>
//         </div>

//         <Card className="shadow-xl border-0">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
//             <CardDescription className="text-center">
//               Sign in to access your dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {error && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="admin@encoderbytes.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-[#5d88c6] hover:bg-[#4a6fa5] text-white"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600 text-center font-medium">Demo Credentials</p>
//               <p className="text-xs text-gray-500 text-center mt-1">
//                 Email: admin@encoderbytes.com
//               </p>
//               <p className="text-xs text-gray-500 text-center">
//                 Password: admin123
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <p className="text-center text-sm text-gray-500 mt-6">
//           © 2025 EncoderBytes. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


















import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, resetPassword, error } = useAuth();
  const navigate = useNavigate();

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 shadow-lg shadow-slate-200 mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">EncoderBytes</h1>
          <p className="text-gray-500 text-sm mt-1">Enterprise Resource Planning</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-bold text-center">
              {view === 'login' ? 'Welcome Back' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {view === 'login' 
                ? 'Sign in to access your dashboard' 
                : 'Enter your email to receive recovery instructions'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 text-xs py-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* --- LOGIN VIEW --- */}
            {view === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button 
                      type="button"
                      onClick={() => { setView('forgot'); setResetSent(false); }}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 bg-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
            )}

            {/* --- FORGOT PASSWORD VIEW --- */}
            {view === 'forgot' && (
              <>
                {resetSent ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Check your email</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
                        We have sent password recovery instructions to {email}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setView('login')} className="w-full">
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 bg-white"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-gray-500"
                      onClick={() => setView('login')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Button>
                  </form>
                )}
              </>
            )}
          </CardContent>
          
          {/* Footer removed for cleaner look, handled in copyright below */}
        </Card>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 EncoderBytes. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;