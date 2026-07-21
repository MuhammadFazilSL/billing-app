
interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800';
  let label = status;

  switch (status.toUpperCase()) {
    case 'ACTIVE':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'INACTIVE':
    case 'SUSPENDED':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'EXPIRED':
    case 'DELETED':
    case 'CANCELLED':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'TRIAL':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    default:
      if (status === 'true') {
        colorClass = 'bg-green-100 text-green-800';
        label = 'YES';
      } else if (status === 'false') {
        colorClass = 'bg-red-100 text-red-800';
        label = 'NO';
      }
      break;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}
