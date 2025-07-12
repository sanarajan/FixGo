import { injectable, inject } from "tsyringe";
import { INotificationRepository } from "../../../../domain/repositories/INotificationRepository";
import {INotification} from "../../../../domain/models/INotification";
@injectable()
export class NotificationUsecase {
  constructor(
    @inject("INotificationRepository") private notificationService: INotificationRepository,
    
  ) {}

  async execute( providerId?:string): Promise<{data:INotification[],totalCount:number}> {
    const {data,totalCount}= await this.notificationService.providerNotification(providerId);

    return {data,totalCount}
  }
}
