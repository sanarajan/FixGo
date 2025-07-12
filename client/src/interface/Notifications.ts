// Example type for notifications (replace or import your real one)
export interface INotification {
  _id: string;
  title: string;
  reason: string;
  isRead: boolean;
  createdAt: string;
  message?: string;
  rejectedStaff: string; 
  type?: string; 
}
