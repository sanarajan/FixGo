 export const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-red-500";
      case "Upcoming":
        return "bg-yellow-500";
      case "OnGoing":
        return "bg-orange-500";
      case "Completed":
        return "bg-green-600";
      case "Cancelled":
        return "bg-grey-600";
      default:
        return "bg-black-400";
    }
  };