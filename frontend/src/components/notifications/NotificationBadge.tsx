export const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  );
};
