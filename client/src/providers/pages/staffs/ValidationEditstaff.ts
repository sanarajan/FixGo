


 
  

export const hasDataChanged = (orgService:string[],selectedServices:{
        [key:string]:string[]
    }) : boolean=> {
    const original = [...orgService].sort();

   const current = Object.entries(selectedServices)
    .flatMap(([serviceId, subIds]) =>
      subIds.map((subId) => `${serviceId}-${subId}`)
    )
    .sort();

  return JSON.stringify(original) !== JSON.stringify(current);
};

  
  
  
  