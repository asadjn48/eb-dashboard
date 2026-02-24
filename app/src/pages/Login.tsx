
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Mail, Lock, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   // --- Handlers ---
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4">
//       <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
//         {/* Logo Section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 shadow-lg shadow-slate-200 mb-4">
//             <Building2 className="w-7 h-7 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">EncoderBytes</h1>
//           <p className="text-gray-500 text-sm mt-1">Enterprise Resource Planning</p>
//         </div>

//         <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardHeader className="space-y-1 pb-2">
//             <CardTitle className="text-xl font-bold text-center">
//               {view === 'login' ? 'Welcome Back' : 'Reset Password'}
//             </CardTitle>
//             <CardDescription className="text-center">
//               {view === 'login' 
//                 ? 'Sign in to access your dashboard' 
//                 : 'Enter your email to receive recovery instructions'}
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             {error && (
//               <Alert variant="destructive" className="mb-4 text-xs py-2">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {/* --- LOGIN VIEW --- */}
//             {view === 'login' && (
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="name@company.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-9 bg-white"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <Label htmlFor="password">Password</Label>
//                     <button 
//                       type="button"
//                       onClick={() => { setView('forgot'); setResetSent(false); }}
//                       className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="pl-9 bg-white"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full mt-2"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
//                 </Button>
//               </form>
//             )}

//             {/* --- FORGOT PASSWORD VIEW --- */}
//             {view === 'forgot' && (
//               <>
//                 {resetSent ? (
//                   <div className="text-center py-6 space-y-4">
//                     <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
//                       <CheckCircle2 className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-900">Check your email</h3>
//                       <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
//                         We have sent password recovery instructions to {email}
//                       </p>
//                     </div>
//                     <Button variant="outline" onClick={() => setView('login')} className="w-full">
//                       Back to Login
//                     </Button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleReset} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="reset-email">Email Address</Label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                         <Input
//                           id="reset-email"
//                           type="email"
//                           placeholder="name@company.com"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           className="pl-9 bg-white"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <Button type="submit" className="w-full" disabled={isLoading}>
//                       {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
//                     </Button>
                    
//                     <Button 
//                       type="button" 
//                       variant="ghost" 
//                       className="w-full text-gray-500"
//                       onClick={() => setView('login')}
//                     >
//                       <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
//                     </Button>
//                   </form>
//                 )}
//               </>
//             )}
//           </CardContent>
          
//           {/* Footer removed for cleaner look, handled in copyright below */}
//         </Card>

//         <p className="text-center text-xs text-gray-400 mt-8">
//           © 2026 EncoderBytes. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Mail, Lock, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-8 overflow-hidden">
      
//       {/* Ambient Background Glows */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none" />

//       <div className="w-full max-w-[420px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Main Card */}
//         <Card className="shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border-white/60 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          
//           <CardHeader className="space-y-2 pb-6 pt-8 px-8">
//             <CardTitle className="text-2xl font-bold text-slate-900 text-center">
//               {view === 'login' ? 'Welcome Back' : 'Recover Account'}
//             </CardTitle>
//             <CardDescription className="text-center text-slate-500 text-sm">
//               {view === 'login' 
//                 ? 'Enter your credentials to access your dashboard' 
//                 : 'Enter your email to receive recovery instructions'}
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent className="px-8 pb-8">
//             {error && (
//               <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//                 <ShieldAlert className="h-4 w-4" />
//                 <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//               </Alert>
//             )}

//             {/* --- LOGIN VIEW --- */}
//             {view === 'login' && (
//               <form onSubmit={handleLogin} className="space-y-5">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
//                   <div className="relative group">
//                     <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//                     <Input
//                       id="email"
//                       type="email"
//                       autoComplete="email"
//                       placeholder="name@company.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all rounded-xl shadow-sm"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</Label>
//                     <button 
//                       type="button"
//                       onClick={() => { setView('forgot'); setResetSent(false); }}
//                       className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-all"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                   <div className="relative group">
//                     <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//                     <Input
//                       id="password"
//                       type="password"
//                       autoComplete="current-password"
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all rounded-xl shadow-sm"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-11 mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md shadow-slate-900/10 transition-all"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
//                 </Button>
//               </form>
//             )}

//             {/* --- FORGOT PASSWORD VIEW --- */}
//             {view === 'forgot' && (
//               <div className="animate-in slide-in-from-right-4 duration-300">
//                 {resetSent ? (
//                   <div className="text-center py-4 space-y-5">
//                     <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-4 ring-emerald-50">
//                       <CheckCircle2 className="w-8 h-8" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-slate-900">Check your email</h3>
//                       <p className="text-sm text-slate-500 mt-2 mx-auto leading-relaxed">
//                         We've sent password recovery instructions to <span className="font-semibold text-slate-700">{email}</span>
//                       </p>
//                     </div>
//                     <Button 
//                       variant="outline" 
//                       onClick={() => setView('login')} 
//                       className="w-full h-11 mt-2 rounded-xl font-semibold border-slate-200 hover:bg-slate-50"
//                     >
//                       Back to Login
//                     </Button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleReset} className="space-y-5">
//                     <div className="space-y-2">
//                       <Label htmlFor="reset-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Email</Label>
//                       <div className="relative group">
//                         <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//                         <Input
//                           id="reset-email"
//                           type="email"
//                           autoComplete="email"
//                           placeholder="name@company.com"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all rounded-xl shadow-sm"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <Button 
//                       type="submit" 
//                       className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md shadow-slate-900/10 transition-all" 
//                       disabled={isLoading}
//                     >
//                       {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send Recovery Link'}
//                     </Button>
                    
//                     <Button 
//                       type="button" 
//                       variant="ghost" 
//                       className="w-full h-11 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all"
//                       onClick={() => setView('login')}
//                     >
//                       <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
//                     </Button>
//                   </form>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;
















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert } from 'lucide-react';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const { login, error } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo (Blurred & Low Opacity) */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Title */}
//         <h1 className="text-[32px] font-medium text-[#5d88c6] text-center mb-12 tracking-tight">
//           Logo
//         </h1>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleLogin} className="space-y-8">
//           <div className="space-y-1">
//             <Input
//               id="email"
//               type="email"
//               autoComplete="email"
//               placeholder="interface-chemist"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//               required
//             />
//           </div>

//           <div className="space-y-1">
//             <Input
//               id="password"
//               type="password"
//               autoComplete="current-password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//               required
//             />
//           </div>

//           <Button
//             type="submit"
//             className="w-full h-12 mt-8 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
//             disabled={isLoading}
//           >
//             {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;






















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo (Blurred & Low Opacity) */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Title */}
//         <h1 className="text-[32px] font-medium text-[#5d88c6] text-center mb-10 tracking-tight transition-all">
//           Logo
//         </h1>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* --- LOGIN VIEW --- */}
//         {view === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
//             <div className="space-y-1">
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="interface-chemist"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
//               <div className="flex justify-end pt-1">
//                 <button 
//                   type="button"
//                   onClick={() => { setView('forgot'); setResetSent(false); }}
//                   className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
//             </Button>
//           </form>
//         )}

//         {/* --- FORGOT PASSWORD VIEW --- */}
//         {view === 'forgot' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//             {resetSent ? (
//               <div className="text-center py-4 space-y-4">
//                 <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle2 className="w-7 h-7" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-medium text-slate-800">Check your email</h3>
//                   <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
//                     We've sent recovery instructions to <br/>
//                     <span className="font-medium text-[#5d88c6]">{email}</span>
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => setView('login')} 
//                   className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#5A52E0] hover:bg-transparent text-[14px]"
//                 >
//                   Back to login
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleReset} className="space-y-6">
//                 <p className="text-[14px] text-slate-500 text-center mb-6">
//                   Enter your email to reset your password.
//                 </p>

//                 <div className="space-y-1">
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                     required
//                   />
//                 </div>

//                 <div className="pt-2 space-y-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
//                     onClick={() => setView('login')}
//                   >
//                     Back to login
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;


















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo (Blurred & Low Opacity) */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Responsive Logo Image */}
//         <div className="flex justify-center mb-10">
//           <img 
//             src="./logo.png" 
//             alt="Logo" 
//             className="h-16 sm:h-20 w-auto object-contain transition-all"
//           />
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* --- LOGIN VIEW --- */}
//         {view === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
//             <div className="space-y-1">
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="interface-chemist"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
//               <div className="flex justify-end pt-1">
//                 <button 
//                   type="button"
//                   onClick={() => { setView('forgot'); setResetSent(false); }}
//                   className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
//             </Button>
//           </form>
//         )}

//         {/* --- FORGOT PASSWORD VIEW --- */}
//         {view === 'forgot' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//             {resetSent ? (
//               <div className="text-center py-4 space-y-4">
//                 <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle2 className="w-7 h-7" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-medium text-slate-800">Check your email</h3>
//                   <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
//                     We've sent recovery instructions to <br/>
//                     <span className="font-medium text-[#5d88c6]">{email}</span>
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => setView('login')} 
//                   className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#5A52E0] hover:bg-transparent text-[14px]"
//                 >
//                   Back to login
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleReset} className="space-y-6">
//                 <p className="text-[14px] text-slate-500 text-center mb-6">
//                   Enter your email to reset your password.
//                 </p>

//                 <div className="space-y-1">
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                     required
//                   />
//                 </div>

//                 <div className="pt-2 space-y-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
//                     onClick={() => setView('login')}
//                   >
//                     Back to login
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert, CheckCircle2, Mic, MicOff } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // Extending Window interface to avoid TypeScript errors for Web Speech API
// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   // Voice State: Tracks which field is currently listening
//   const [activeMic, setActiveMic] = useState<'email' | 'password' | null>(null);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   // --- Voice Input Handler ---
//   const handleVoiceInput = (field: 'email' | 'password') => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
//     if (!SpeechRecognition) {
//       alert('Sorry, your browser does not support voice input. Try using Google Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.continuous = false; // Stop listening automatically after they speak
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setActiveMic(field);
//     };

//     recognition.onresult = (event: any) => {
//       // Get the spoken words
//       const transcript = event.results[0][0].transcript;
      
//       if (field === 'email') {
//         // Clean up email: remove spaces, lowercase, fix common "at" and "dot" errors
//         let cleanedEmail = transcript.toLowerCase()
//           .replace(/\s+/g, '')
//           .replace(/at/g, '@')
//           .replace(/dot/g, '.');
//         setEmail(cleanedEmail);
//       } else {
//         // Passwords shouldn't have spaces injected by speech
//         setPassword(transcript.replace(/\s+/g, ''));
//       }
//     };

//     recognition.onerror = (event: any) => {
//       console.error("Speech recognition error:", event.error);
//       setActiveMic(null);
//     };

//     recognition.onend = () => {
//       setActiveMic(null);
//     };

//     recognition.start();
//   };

//   // --- Form Handlers ---
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo (Blurred & Low Opacity) */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Responsive Logo Image */}
//         <div className="flex justify-center mb-10">
//           <img 
//             src="/logo.png" 
//             alt="Logo" 
//             className="h-16 sm:h-20 w-auto object-contain transition-all"
//           />
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* --- LOGIN VIEW --- */}
//         {view === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            
//             {/* Email Field */}
//             <div className="space-y-1 relative">
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => handleVoiceInput('email')}
//                 className={cn(
//                   "absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
//                   activeMic === 'email' ? "text-white bg-red-500 animate-pulse" : "text-slate-400 hover:text-[#5d88c6]"
//                 )}
//                 title="Dictate Email"
//               >
//                 {activeMic === 'email' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
//               </button>
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2 relative">
//               <Input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => handleVoiceInput('password')}
//                 className={cn(
//                   "absolute right-1 top-[14px] p-2 rounded-full transition-all",
//                   activeMic === 'password' ? "text-white bg-red-500 animate-pulse" : "text-slate-400 hover:text-[#5d88c6]"
//                 )}
//                 title="Dictate Password"
//               >
//                 {activeMic === 'password' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
//               </button>
              
//               <div className="flex justify-end pt-1">
//                 <button 
//                   type="button"
//                   onClick={() => { setView('forgot'); setResetSent(false); }}
//                   className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
//             </Button>
//           </form>
//         )}

//         {/* --- FORGOT PASSWORD VIEW --- */}
//         {view === 'forgot' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//             {resetSent ? (
//               <div className="text-center py-4 space-y-4">
//                 <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle2 className="w-7 h-7" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-medium text-slate-800">Check your email</h3>
//                   <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
//                     We've sent recovery instructions to <br/>
//                     <span className="font-medium text-[#5d88c6]">{email}</span>
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => setView('login')} 
//                   className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#5A52E0] hover:bg-transparent text-[14px]"
//                 >
//                   Back to login
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleReset} className="space-y-6">
//                 <p className="text-[14px] text-slate-500 text-center mb-6">
//                   Enter your email to reset your password.
//                 </p>

//                 <div className="space-y-1 relative">
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleVoiceInput('email')}
//                     className={cn(
//                       "absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
//                       activeMic === 'email' ? "text-white bg-red-500 animate-pulse" : "text-slate-400 hover:text-[#5d88c6]"
//                     )}
//                   >
//                     {activeMic === 'email' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
//                   </button>
//                 </div>

//                 <div className="pt-2 space-y-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
//                     onClick={() => setView('login')}
//                   >
//                     Back to login
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;







































// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert, CheckCircle2, Mic, MicOff, Radio } from 'lucide-react';
// import { cn } from '@/lib/utils';

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   // Voice Assistant State
//   const [isListening, setIsListening] = useState(false);
//   const [activeField, setActiveField] = useState<'email' | 'password'>('email');
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   // Refs to access latest state inside the Speech Recognition closure
//   const emailRef = useRef(email);
//   const passwordRef = useRef(password);
//   const isListeningRef = useRef(isListening);
//   const activeFieldRef = useRef(activeField);
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => { emailRef.current = email; }, [email]);
//   useEffect(() => { passwordRef.current = password; }, [password]);
//   useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
//   useEffect(() => { activeFieldRef.current = activeField; }, [activeField]);

//   // --- Voice Command Initialization ---
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return; // Browser doesn't support it

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true; // Stay on continuously
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';

//     recognition.onresult = (event: any) => {
//       // Get the most recently spoken phrase
//       const currentIdx = event.resultIndex;
//       const transcript = event.results[currentIdx][0].transcript.trim().toLowerCase();
//       console.log("Voice Command:", transcript);

//       handleVoiceCommand(transcript);
//     };

//     recognition.onerror = (event: any) => {
//       console.error("Speech recognition error:", event.error);
//       if (event.error === 'not-allowed') setIsListening(false);
//     };

//     // Auto-restart if it stops but we still want to be listening
//     recognition.onend = () => {
//       if (isListeningRef.current) {
//         try { recognition.start(); } catch (e) { /* ignore restart errors */ }
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//     };
//   }, []);

//   // --- Voice Logic Processor ---
//   const handleVoiceCommand = (text: string) => {
//     // 1. LOGIN COMMAND
//     if (text === 'login' || text === 'log in' || text === 'submit') {
//       executeLogin();
//       return;
//     }

//     // Helper to clean email dictates
//     const cleanEmail = (str: string) => str.replace(/\s+/g, '').replace(/at/g, '@').replace(/dot/g, '.');

//     // 2. EMAIL COMMAND (e.g., "email test at gmail dot com")
//     if (text.startsWith('email')) {
//       setActiveField('email');
//       const content = text.replace(/^email\s*/, '');
//       if (content) {
//         // If they just say "email", it focuses. If they say "email john...", it fills.
//         setEmail(cleanEmail(content));
//       }
//       return;
//     }

//     // 3. NEXT / PASSWORD COMMAND
//     if (text === 'next' || text.startsWith('password')) {
//       setActiveField('password');
//       const content = text.replace(/^(password|next)\s*/, '');
//       if (content) {
//         setPassword(content.replace(/\s+/g, ''));
//       }
//       return;
//     }

//     // 4. DICTATE INTO ACTIVE FIELD (No specific command word used)
//     if (activeFieldRef.current === 'email') {
//       // Append if email exists, otherwise set
//       setEmail(prev => prev ? cleanEmail(prev + text) : cleanEmail(text));
//     } else if (activeFieldRef.current === 'password') {
//       setPassword(prev => prev + text.replace(/\s+/g, ''));
//     }
//   };

//   const toggleListening = () => {
//     if (!recognitionRef.current) {
//       alert("Voice input is not supported in this browser. Please use Chrome.");
//       return;
//     }
    
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       setEmail(''); // Clear form on new dictation to prevent messy appending
//       setPassword('');
//       setActiveField('email');
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   // --- Form Handlers ---
//   const executeLogin = async () => {
//     if (!emailRef.current || !passwordRef.current) return;
//     setIsLoading(true);
//     try {
//       await login(emailRef.current, passwordRef.current);
//       if (recognitionRef.current) recognitionRef.current.stop(); // Turn off mic on success
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     executeLogin();
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Voice Mode Indicator */}
//         {isListening && (
//           <div className="absolute -top-12 left-0 right-0 flex justify-center animate-in slide-in-from-top-4">
//             <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ring-1 ring-red-200">
//               <Radio className="w-3.5 h-3.5 animate-pulse" />
//               Voice Mode Active
//             </div>
//           </div>
//         )}

//         {/* Responsive Logo Image */}
//         <div className="flex justify-center mb-10">
//           <img 
//             src="/logo.png" 
//             alt="Logo" 
//             className="h-16 sm:h-20 w-auto object-contain transition-all"
//           />
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* --- LOGIN VIEW --- */}
//         {view === 'login' && (
//           <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            
//             {/* Email Field */}
//             <div className="space-y-1 relative">
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onClick={() => setActiveField('email')}
//                 className={cn(
//                   "h-12 bg-transparent border-0 border-b-[1.5px] rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10",
//                   activeField === 'email' && isListening ? "border-[#5d88c6] bg-[#5d88c6]/5" : "border-slate-300"
//                 )}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={toggleListening}
//                 className={cn(
//                   "absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
//                   isListening && activeField === 'email' ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-[#5d88c6]"
//                 )}
//                 title="Toggle Voice Assistant"
//               >
//                 {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
//               </button>
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2 relative">
//               <Input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onClick={() => setActiveField('password')}
//                 className={cn(
//                   "h-12 bg-transparent border-0 border-b-[1.5px] rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10",
//                   activeField === 'password' && isListening ? "border-[#5d88c6] bg-[#5d88c6]/5" : "border-slate-300"
//                 )}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={toggleListening}
//                 className={cn(
//                   "absolute right-1 top-[14px] p-2 rounded-full transition-all",
//                   isListening && activeField === 'password' ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-[#5d88c6]"
//                 )}
//                 title="Toggle Voice Assistant"
//               >
//                 {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
//               </button>
              
//               <div className="flex justify-end pt-1">
//                 <button 
//                   type="button"
//                   onClick={() => { setView('forgot'); setResetSent(false); }}
//                   className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
//             </Button>
//           </form>
//         )}

//         {/* --- FORGOT PASSWORD VIEW --- */}
//         {view === 'forgot' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//             {resetSent ? (
//               <div className="text-center py-4 space-y-4">
//                 <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle2 className="w-7 h-7" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-medium text-slate-800">Check your email</h3>
//                   <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
//                     We've sent recovery instructions to <br/>
//                     <span className="font-medium text-[#5d88c6]">{email}</span>
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => setView('login')} 
//                   className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#5A52E0] hover:bg-transparent text-[14px]"
//                 >
//                   Back to login
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleReset} className="space-y-6">
//                 <p className="text-[14px] text-slate-500 text-center mb-6">
//                   Enter your email to reset your password.
//                 </p>

//                 <div className="space-y-1 relative">
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors pr-10"
//                     required
//                   />
//                 </div>

//                 <div className="pt-2 space-y-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
//                     onClick={() => setView('login')}
//                   >
//                     Back to login
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;


























// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// const Login: React.FC = () => {
//   const [view, setView] = useState<'login' | 'forgot'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
  
//   // UX Improvement: Toggle password visibility
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { login, resetPassword, error } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await resetPassword(email);
//       setResetSent(true);
//     } catch (err) {
//       // Error handled by context
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
//       {/* Background Logo (Blurred & Low Opacity) */}
//       <div 
//         className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] blur-xl bg-center bg-no-repeat bg-contain"
//         style={{ backgroundImage: 'url(/logo.png)' }}
//       />

//       {/* Main Container */}
//       <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
//         {/* Responsive Logo Image */}
//         <div className="flex justify-center mb-10">
//           <img 
//             src="/logo.png" 
//             alt="Logo" 
//             className="h-16 sm:h-20 w-auto object-contain transition-all"
//           />
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
//             <ShieldAlert className="h-4 w-4" />
//             <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* --- LOGIN VIEW --- */}
//         {view === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            
//             {/* Email Field */}
//             <div className="space-y-1">
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2 relative">
//               <Input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 autoComplete="current-password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 pr-10 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                 required
//               />
              
//               {/* Password Visibility Toggle */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-2 top-3 p-1 text-slate-400 hover:text-[#5d88c6] transition-colors"
//                 tabIndex={-1}
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
              
//               <div className="flex justify-end pt-1">
//                 <button 
//                   type="button"
//                   onClick={() => { setView('forgot'); setResetSent(false); }}
//                   className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#6992cd] text-white text-[15px] font-medium transition-all shadow-sm"
//               disabled={isLoading}
//             >
//               {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Login'}
//             </Button>
//           </form>
//         )}

//         {/* --- FORGOT PASSWORD VIEW --- */}
//         {view === 'forgot' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//             {resetSent ? (
//               <div className="text-center py-4 space-y-4">
//                 <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle2 className="w-7 h-7" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-medium text-slate-800">Check your email</h3>
//                   <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
//                     We've sent recovery instructions to <br/>
//                     <span className="font-medium text-[#5d88c6]">{email}</span>
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   onClick={() => setView('login')} 
//                   className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#6992cd] hover:bg-transparent text-[14px]"
//                 >
//                   Back to login
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleReset} className="space-y-6">
//                 <p className="text-[14px] text-slate-500 text-center mb-6">
//                   Enter your email to reset your password.
//                 </p>

//                 <div className="space-y-1">
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
//                     required
//                   />
//                 </div>

//                 <div className="pt-2 space-y-3">
//                   <Button 
//                     type="submit" 
//                     className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#6992cd] text-white text-[15px] font-medium transition-all shadow-sm" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
//                   </Button>
                  
//                   <Button 
//                     type="button" 
//                     variant="ghost" 
//                     className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
//                     onClick={() => setView('login')}
//                   >
//                     Back to login
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle2, User, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, resetPassword, error } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      
      {/* ==================================================== */}
      {/* LEFT PANEL: IMAGE & BRANDING (Hidden on Mobile)      */}
      {/* ==================================================== */}
      <div className="relative hidden md:flex w-1/2 lg:w-[55%] flex-col justify-between bg-slate-900 overflow-hidden">
        
        {/*  COMPANY IMAGE HERE */}
       
        {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-90" /> */}
        <div className="absolute inset-0 bg-[url('/company.jpg')] bg-cover bg-center opacity-90" />
        
      
        <div className="absolute inset-0 bg-[#5d88c6]/80 mix-blend-multiply" />
        
        {/* Content over the image */}
        <div className="relative z-10 p-12 lg:p-16 h-full flex flex-col justify-center pb-24">
          <img src="/logo.png" alt="Company Logo" className="w-32 mb-6 brightness-0 invert opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            EncoderBytes ERP
          </h2>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Secure, internal enterprise resource planning workspace. Please log in to access your dashboard.
          </p>
        </div>
      </div>

      {/* ==================================================== */}
      {/* RIGHT PANEL: LOGIN FORM                              */}
      {/* ==================================================== */}
      <div className="relative flex w-full md:w-1/2 lg:w-[45%] flex-col items-center justify-center px-6 md:px-12 bg-white">
        
        {/* SVG Divider */}
        <svg 
          className="absolute left-0 top-0 h-full w-[120px] lg:w-[150px] -translate-x-[99%] text-white fill-current hidden md:block pointer-events-none" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Custom S-Curve Path to match the design */}
          <path d="M 100 0 C -30 25, 130 75, 100 100 Z" />
        </svg>

        {/* Mobile Logo (Only visible on small screens) */}
        <div className="md:hidden flex justify-center mb-8">
           <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[360px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-semibold text-gray-800 tracking-tight">
              Welcome
            </h1>
            <p className="text-[14px] text-gray-500 mt-2">
              Log in to your account to continue
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2 rounded-xl">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {/* --- LOGIN VIEW --- */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Input */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-[#5d88c6] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@encoderbytes.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[46px] pl-11 pr-4 bg-transparent border-gray-300 rounded-full text-[14px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#5d88c6]/50 focus-visible:border-[#5d88c6] transition-all shadow-sm"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-[#5d88c6] transition-colors" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[46px] pl-11 pr-4 bg-transparent border-gray-300 rounded-full text-[14px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#5d88c6]/50 focus-visible:border-[#5d88c6] transition-all shadow-sm tracking-widest"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end mt-1 mb-2">
                <button 
                  type="button"
                  onClick={() => { setView('forgot'); setResetSent(false); }}
                  className="text-[12px] text-gray-400 hover:text-[#5d88c6] transition-colors font-medium"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Login Button (Pill shaped, matching design) */}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  className="w-[98%] h-[44px]  rounded-full bg-[#5d88c6] hover:bg-[#4a70a6] text-white text-[15px] font-medium transition-all shadow-md shadow-[#5d88c6]/20"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Log In'}
                </Button>
              </div>
            </form>
          )}

          {/* --- FORGOT PASSWORD VIEW --- */}
          {view === 'forgot' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {resetSent ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-50">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Check your email</h3>
                    <p className="text-[13px] text-gray-500 mt-2 mx-auto leading-relaxed">
                      Recovery instructions sent to <br/>
                      <span className="font-medium text-[#5d88c6]">{email}</span>
                    </p>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setView('login')} 
                      className="rounded-full text-[#5d88c6] hover:text-[#4a70a6] hover:bg-[#5d88c6]/10 text-[14px]"
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-5">
                  
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-[#5d88c6] transition-colors" />
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[46px] pl-11 pr-4 bg-transparent border-gray-300 rounded-full text-[14px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#5d88c6]/50 focus-visible:border-[#5d88c6] transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="w-[75%] h-[44px] rounded-full bg-[#5d88c6] hover:bg-[#4a70a6] text-white text-[15px] font-medium transition-all shadow-md shadow-[#5d88c6]/20" 
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
                    </Button>
                    
                    <button 
                      type="button" 
                      onClick={() => setView('login')}
                      className="text-[13px] text-gray-400 hover:text-[#5d88c6] transition-colors font-medium mt-2"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Text (Replaces public signup logic) */}
          <div className="mt-12 text-center">
             <p className="text-[12px] text-gray-400">
               Need an account? <span className="text-[#5d88c6] font-medium cursor-pointer hover:underline">Contact IT Support</span>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;