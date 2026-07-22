import { BellRing } from 'lucide-react';

export const NotificationEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 border border-white/10 rounded-xl">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
        <BellRing className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-200 mb-2">All caught up!</h3>
      <p className="text-gray-500 max-w-[250px]">
        You have no new notifications. We'll let you know when something comes up.
      </p>
    </div>
  );
};
