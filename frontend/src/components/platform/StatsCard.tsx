
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span
              className={`ml-2 text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
      {icon && (
        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  );
}
