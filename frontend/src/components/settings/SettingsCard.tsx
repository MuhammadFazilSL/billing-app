import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  onSave,
  isLoading,
  isSaving,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6"><Loading /></div>
        ) : (
          children
        )}
      </CardContent>
      {onSave && (
        <CardFooter className="border-t border-border pt-6 flex justify-end">
          <Button onClick={onSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
