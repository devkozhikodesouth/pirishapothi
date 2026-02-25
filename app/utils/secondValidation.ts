export const validateSecondPart = (formData:any,setErrors:any  ) => {
  const newErrors: Record<string, string> = {};

  if (!formData.sector) {
    newErrors.sector = "Please select a sector";
  }

  if (!formData.unit) {
    newErrors.unit = "Please select a unit";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};