export interface OfferRow {
  providerServiceId: { image: string };
  serviceId: { serviceName: string };
  subcategoryId?: { subcategory: string };
  offerFor: "subcategory" | "service";
  offerType: "percentage" | "fixed";
  offerValue: number;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}
