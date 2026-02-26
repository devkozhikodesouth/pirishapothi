import React from "react";
import FormInput from "../components/FormInput";
import { RadixButton } from "../components/RadixButton";
import { Flex } from "@radix-ui/themes";
import { validateFirstPart } from "../utils/FirstValidation";

function FirstPart({
  formData,
  setFormData,
  setFirstOk,
  setErrors,
    errors
}: {
  formData: any;
  setFormData: any;
  setFirstOk: any;
  setErrors: any;
  errors: Record<string, string>;
}) {
  return (
    <>
      <FormInput
    
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        name="Full Name"
        placeholder="Enter your full name"
        type="text"
        error={errors.name}
      />
      <FormInput
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        name="Phone Number"
        placeholder="Enter your phone number"
        type="tel"
        error={errors.phone}
      />
      <FormInput
        value={formData.place}
        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
        name="Place"
        placeholder="Enter your place"
        type="text"
        error={errors.place}
      />
      {/* <OrderCountStepper
  value={formData.orderCount}
  onChange={(val) =>
    setFormData({
      ...formData,
      orderCount: val,
    })
  }
  error={errors.orderCount}
/> */}
      <FormInput
        value={formData.orderCount.toString()}
        onChange={(e) =>
          setFormData({
            ...formData,
            orderCount: parseInt(e.target.value) || 0,  
          })
        }
        name="Order Count"
        placeholder="Enter order count"
        type="number"
        error={errors.orderCount}
      />

      <Flex justify="center" mt="5" direction={'column'}>
        <RadixButton type={"button"}   onClick={() => {
    if (validateFirstPart(formData,setErrors)) {
      setFirstOk(false);
    }
  }}>Continue</RadixButton>
      </Flex>
    </>
  );
}

export default FirstPart;
