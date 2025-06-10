interface ServicePair {
  serviceId: string;
  subcategoryId: string;
}

export function extractServicePairs(services: any): ServicePair[] {
  const pairs: ServicePair[] = [];
  for (const [serviceId, subcategories] of Object.entries(services)) {
    if (Array.isArray(subcategories)) {
      for (const subId of subcategories) {
        pairs.push({ serviceId, subcategoryId: subId });
      }
    }
  }
  return pairs;
}

export function compareServices(
  currentServicesObj: any,
  oldServicesArray: any[]
): { toAdd: ServicePair[]; toRemove: ServicePair[] } {
  const newServicePairs = extractServicePairs(currentServicesObj);
  const oldServicePairs: ServicePair[] = oldServicesArray.map(s => ({
    serviceId: s.serviceId,
    subcategoryId: s.subcategoryId,
  }));

  const toAdd = newServicePairs.filter(
    newItem =>
      !oldServicePairs.some(
        oldItem =>
          oldItem.serviceId === newItem.serviceId &&
          oldItem.subcategoryId === newItem.subcategoryId
      )
  );

  const toRemove = oldServicePairs.filter(
    oldItem =>
      !newServicePairs.some(
        newItem =>
          newItem.serviceId === oldItem.serviceId &&
          newItem.subcategoryId === oldItem.subcategoryId
      )
  );

 
  return { toAdd, toRemove };
}
