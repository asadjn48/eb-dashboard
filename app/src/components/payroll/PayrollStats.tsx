// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Wallet, CheckCircle2, Clock, Users } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { formatCurrency } from '@/utils/formatters';
// import { cn } from '@/lib/utils';

// const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
//   <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
//     <CardContent className="p-5 py-0">
//       <div className="flex justify-between items-start">
//         <div className="space-y-1">
//           <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
//           <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
//           {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
//         </div>
//         <div className={cn("p-3 rounded-xl bg-opacity-10", colorClass)}>
//           <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// export const PayrollStats = ({ stats }: { stats: any }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard title="Total Payroll" value={formatCurrency(stats.total)} subtext="Projected for this month" icon={Wallet} colorClass="bg-indigo-50 text-indigo-600" />
//         <StatCard title="Paid Amount" value={formatCurrency(stats.paid)} subtext={`${stats.paidCount} employees paid`} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" />
//         <StatCard title="Pending Dues" value={formatCurrency(stats.pending)} subtext={`${stats.pendingCount} remaining`} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
//         <StatCard title="Total Staff" value={stats.count} subtext="Active employees" icon={Users} colorClass="bg-blue-50 text-blue-600" />
//     </div>
//   );
// };

















/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet, AlertOctagon, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
  <Card className="border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
    <CardContent className="p-5">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs font-medium text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={cn("p-3 rounded-xl bg-opacity-10 transition-transform group-hover:scale-110 duration-300", colorClass)}>
          <Icon className={cn("w-5 h-5", colorClass.replace("bg-", "text-"))} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PayrollStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 w-full">
        <StatCard title="Total Arrears (Due)" value={formatCurrency(stats.totalArrears)} subtext="Global amount owed to staff" icon={Wallet} colorClass="bg-rose-50 text-rose-600" />
        <StatCard title="Staff In Arrears" value={stats.employeesInArrears} subtext="Employees awaiting payment" icon={AlertOctagon} colorClass="bg-amber-50 text-amber-600" />
        <StatCard title="Advances Paid" value={formatCurrency(stats.totalAdvances)} subtext="Overpaid / Loan balances" icon={TrendingUp} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Active Payroll Roster" value={stats.count} subtext="Total employees monitored" icon={Users} colorClass="bg-[#5d88c6]/10 text-[#5d88c6]" />
    </div>
  );
};