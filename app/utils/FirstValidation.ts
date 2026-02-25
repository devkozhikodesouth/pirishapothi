export const validateFirstPart = (formData:any,setErrors:any) => {
  const newErrors: Record<string, string> = {};

  if (!formData.name || formData.name.length < 3) {
    newErrors.name = "Name must be at least 3 characters";
  }

  if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!formData.place) {
    newErrors.place = "Place is required";
  }

  if (!formData.orderCount || formData.orderCount < 1) {
    newErrors.orderCount = "Order count must be at least 1";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};