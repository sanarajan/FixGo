export const imageValidation = (file: File | null): string | true => {
  if (!file) return "No file selected.";
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, GIF, or WEBP image files are allowed.";
  }
  if (file.size > maxSize) {
    return "photo size must be less than 2MB.";
  }

  return true;
};

export function validatePersonalFields(
  formData: {
    fullname: string;
    username: string;
    phone: string;
    location: string;
  },
  fieldsToValidate: ("fullname" | "username" | "phone" | "location")[]
) {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  for (const field of fieldsToValidate) {
    const value = formData[field]?.trim() ?? "";

    switch (field) {
      case "fullname":
        if (!value) {
          errors.fullname = "Full Name is required";
          isValid = false;
        }
        break;
      case "username":
        if (!value) {
          errors.username = "Username is required";
          isValid = false;
        }
        break;
      case "phone":
        if (!value) {
          errors.phone = "Phone number is required";
          isValid = false;
         } else if (!/^\d{10}$/.test(formData.phone) || /^(\d)\1{9}$/.test(formData.phone)) {
  errors.phone = "Phone must be 10 digits and not all the same digit";
  isValid = false;
}

        break;
      case "location":
        console.log(value+" loction")
        if (!value) {
          errors.location = "Location is required";
          isValid = false;
        }
        break;
    }
  }

  return { isValid, errors };
}

