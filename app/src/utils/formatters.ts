// // export const formatCurrency = (amount: number, currency: string = 'PKR'): string => {
// //   const formatter = new Intl.NumberFormat('en-PK', {
// //     style: 'currency',
// //     currency: currency,
// //     minimumFractionDigits: 0,
// //     maximumFractionDigits: 0,
// //   });
// //   return formatter.format(amount);
// // };

// export const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(amount);
// };









// export const formatNumber = (num: number): string => {
//   return new Intl.NumberFormat('en-PK').format(num);
// };

// // export const formatDate = (dateString: string): string => {
// //   const date = new Date(dateString);
// //   return new Intl.DateTimeFormat('en-PK', {
// //     year: 'numeric',
// //     month: 'short',
// //     day: 'numeric',
// //   }).format(date);
// // };



// export const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric'
//   });
// };





// export const formatShortDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('en-PK', {
//     month: 'short',
//     day: 'numeric',
//   }).format(date);
// };

// export const formatPercentage = (value: number): string => {
//   return `${value.toFixed(1)}%`;
// };

// export const formatCompactNumber = (num: number): string => {
//   const formatter = new Intl.NumberFormat('en-PK', {
//     notation: 'compact',
//     compactDisplay: 'short',
//   });
//   return formatter.format(num);
// };

// export const getMonthName = (monthIndex: number): string => {
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   return months[monthIndex] || '';
// };

// export const calculateGrowth = (current: number, previous: number): number => {
//   if (previous === 0) return 0;
//   return ((current - previous) / previous) * 100;
// };

// export const getInitials = (name: string): string => {
//   return name
//     .split(' ')
//     .map(n => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);
// };

















// ==========================================
// 1. CURRENCY & NUMBERS (PKR Defaults)
// ==========================================

export const formatCurrency = (amount: number, currency = 'PKR') => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // No decimals for cleaner look (e.g. PKR 1,500)
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-PK').format(num);
};

export const formatCompactNumber = (num: number): string => {
  const formatter = new Intl.NumberFormat('en-PK', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(num);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// ==========================================
// 2. DATES (en-PK Locale)
// ==========================================

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
  });
};

// ==========================================
// 3. HELPERS & UTILITIES
// ==========================================

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || '';
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};