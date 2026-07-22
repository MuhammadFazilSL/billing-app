export class CreateNotificationDto {
  tenantId: string;
  module: string;
  type: string;
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
  actionUrl?: string;
}
