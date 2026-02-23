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


















import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] p-6 overflow-hidden">
      
      {/* Background Logo (Blurred & Low Opacity) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] blur-xl bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: 'url(/logo.png)' }}
      />

      {/* Main Container */}
      <div className="w-full max-w-[360px] relative z-10 animate-in fade-in-25 slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Responsive Logo Image */}
        <div className="flex justify-center mb-10">
          <img 
            src="./logo.png" 
            alt="Logo" 
            className="h-16 sm:h-20 w-auto object-contain transition-all"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 text-red-700 animate-in slide-in-from-top-2">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="ml-2 font-medium text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="interface-chemist"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
                required
              />
              <div className="flex justify-end pt-1">
                <button 
                  type="button"
                  onClick={() => { setView('forgot'); setResetSent(false); }}
                  className="text-[13px] text-slate-500 hover:text-[#5d88c6] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-4 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'login'}
            </Button>
          </form>
        )}

        {/* --- FORGOT PASSWORD VIEW --- */}
        {view === 'forgot' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {resetSent ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-100/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-800">Check your email</h3>
                  <p className="text-[13px] text-slate-500 mt-2 mx-auto leading-relaxed">
                    We've sent recovery instructions to <br/>
                    <span className="font-medium text-[#5d88c6]">{email}</span>
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setView('login')} 
                  className="w-full h-12 mt-4 text-[#5d88c6] hover:text-[#5A52E0] hover:bg-transparent text-[14px]"
                >
                  Back to login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <p className="text-[14px] text-slate-500 text-center mb-6">
                  Enter your email to reset your password.
                </p>

                <div className="space-y-1">
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-transparent border-0 border-b-[1.5px] border-slate-300 rounded-none px-1 text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#5d88c6] transition-colors"
                    required
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-[8px] bg-[#5d88c6] hover:bg-[#5A52E0] text-white text-[15px] font-medium transition-all shadow-sm" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send reset link'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full h-12 text-slate-500 hover:text-[#5d88c6] hover:bg-transparent transition-colors text-[14px]"
                    onClick={() => setView('login')}
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;