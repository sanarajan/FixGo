
import {INotification} from "../models/INotification";
export interface INotificationRepository {
  providerNotification(providerId?: string): Promise<{
    data: INotification[];
    totalCount: number;
  }>;
  readNotification(staffId:string,type:string): Promise<boolean>;
}
