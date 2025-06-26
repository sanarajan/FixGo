import { Request, Response } from "express";
import { ProviderServicesModel } from "../../infrastructure/database/models/ProviderServicesModel";
import { StaffServicesModel } from "../../infrastructure/database/models/StaffServicesModel";
import { OrdersModel } from "../../infrastructure/database/models/OrdersModel";

export const saveStaffServices = async (req: Request, res: Response) => {
  try {
    const { staffId, services } = req.body;
    const admin = (req as any).user;
    const createdBy = admin.id;

    if (!staffId || !services) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const staffServicesToInsert = [];
    const incomingServiceSet = new Set<string>();

    // Step 1: Loop through submitted services
    for (const [serviceId, subcategoryIds] of Object.entries(services)) {
      for (const subcategoryId of subcategoryIds as string[]) {
        const uniqueKey = `${serviceId}_${subcategoryId}`;
        incomingServiceSet.add(uniqueKey);

        // Step 1.1: Check if providerService exists
        let providerService = await ProviderServicesModel.findOne({
          serviceId,
          subcategoryId,
          createdBy,
        });

        // Step 1.2: Reactivate if found but inactive
        if (providerService && providerService.status === "Inactive") {
          providerService.status = "Active";
          await providerService.save();
        }

        // Step 1.3: Create if not found
        if (!providerService) {
          providerService = await ProviderServicesModel.create({
            serviceId,
            subcategoryId,
            createdBy,
            status: "Active",
          });
        }

        // Step 1.4: Check if staff already has this service
        const existingStaffService = await StaffServicesModel.findOne({
          staffId,
          providerServiceId: providerService._id,
        });

        if (existingStaffService) {
          // Reactivate if exists but inactive
          if (existingStaffService.status === "Inactive") {
            await StaffServicesModel.updateOne(
              { _id: existingStaffService._id },
              { $set: { status: "Active" } }
            );
          }
        } else {
          // Add to insert list
          staffServicesToInsert.push({
            staffId,
            providerServiceId: providerService._id,
            subcategoryId,
            serviceId,
            service: providerService.service,
            subcategoryName: providerService.subcategoryName,
            createdBy,
            status: "Active",
          });
        }
      }
    }

    // Step 2: Remove or deactivate services not in new list
  const existingStaffServices = await StaffServicesModel.find({ staffId });

for (const staffService of existingStaffServices) {
  const existingKey = `${staffService.serviceId}_${staffService.subcategoryId}`;

  if (!incomingServiceSet.has(existingKey)) {
    const providerServiceId = staffService.providerServiceId;

    const isInUse = await OrdersModel.exists({ providerServiceId });

    if (isInUse) {
      //  Inactivate this staff's service
      await StaffServicesModel.updateOne(
        { _id: staffService._id },
        { $set: { status: "Inactive" } }
      );
    } else {
      // No bookings — delete it fully
      await StaffServicesModel.deleteOne({ _id: staffService._id });
    }

    //   Check if ANY staff still uses it (active only)
    const isUsedByOthers = await StaffServicesModel.exists({
      providerServiceId,
      _id: { $ne: staffService._id }, // exclude the one just inactivated or deleted
      status: "Active",
    });

    if (!isUsedByOthers) {
      await ProviderServicesModel.updateOne(
        { _id: providerServiceId },
        { $set: { status: "Inactive" } }
      );
    }
  }
}


    // Step 3: Insert new staff service assignments
    if (staffServicesToInsert.length > 0) {
      await StaffServicesModel.insertMany(staffServicesToInsert);
    }

    res.status(200).json({ message: "Staff services updated successfully" });
  } catch (error) {
    console.error("Error saving staff services:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
