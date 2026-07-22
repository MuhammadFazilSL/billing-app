import React from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGateProps {
  permission: string;
  mode?: 'hide' | 'disable';
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  mode = 'hide', 
  children 
}) => {
  const hasPermission = usePermission(permission);

  if (hasPermission) {
    return <>{children}</>;
  }

  if (mode === 'hide') {
    return null;
  }

  // mode === 'disable'
  // We wrap the children in a div or clone element to disable it.
  // Cloning is safer if children is a single valid React element.
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { 
      disabled: true,
      className: `${children.props.className || ''} opacity-50 cursor-not-allowed pointer-events-none`.trim()
    });
  }

  return (
    <div className="opacity-50 cursor-not-allowed pointer-events-none">
      {children}
    </div>
  );
};
