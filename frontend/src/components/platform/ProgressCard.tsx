
interface ProgressCardProps {
  title: string;
  used: number;
  allowed: number | 'Unlimited';
}

export function ProgressCard({ title, used, allowed }: ProgressCardProps) {
  let percentage = 0;
  let colorClass = 'bg-green-500';

  if (typeof allowed === 'number') {
    percentage = allowed === 0 ? 100 : Math.min(100, Math.round((used / allowed) * 100));
    if (percentage > 95) colorClass = 'bg-red-500';
    else if (percentage > 80) colorClass = 'bg-yellow-500';
  } else {
    // Unlimited
    percentage = 100;
  }

  const remaining = typeof allowed === 'number' ? Math.max(0, allowed - used) : 'Unlimited';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-500">{title}</h4>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {used} <span className="text-sm font-normal text-gray-500">/ {allowed}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{typeof allowed === 'number' ? `${percentage}%` : ''}</p>
          <p className="text-xs text-gray-500">{remaining} remaining</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
