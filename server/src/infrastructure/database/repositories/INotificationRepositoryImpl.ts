
import { injectable } from "tsyringe";
import {INotificationRepository} from "../../../domain/repositories/INotificationRepository";
import {INotification} from "../../../domain/models/INotification";
import { NotificationModel } from "../../../infrastructure/database/models/NotificationModel "
import  {  Types } from 'mongoose';

@injectable()
export class INotificationRepositoryImpl implements INotificationRepository {
  async providerNotification(provider: string): Promise<{data:INotification[], totalCount:number}> {
   const data = await NotificationModel.find({ userId: provider,isRead:false })
      .sort({ createdAt: -1 });
    const totalCount = await NotificationModel.countDocuments({ userId: provider });
    return { data, totalCount };
}
 async readNotification(staffId:string,type:string): Promise<boolean> {
  console.log("readNotification called with staffId:", staffId, "and type:", type);
  
  const result = await NotificationModel.updateMany(
    {
      rejectedStaff: staffId,
      type: "staff_rejected"
    },
    {
      $set: { isRead: true }
    }
  );

  console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);
  return result.modifiedCount > 0; // Return true if the document was found and updated, false otherwise
}
}

