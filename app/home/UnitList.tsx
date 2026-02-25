"use client";

import { Select } from "@radix-ui/themes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits } from "@/app/redux/Slice/unitSlice";
import { RootState, AppDispatch } from "@/app/redux/store/store";

export default function RadixSelect({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading,error } = useSelector((state: RootState) => state.unit);
console.log(list)
  useEffect(() => {
    dispatch( fetchUnits(formData.sector));
  }, [formData.sector,dispatch]);

  return (
    <>


    <Select.Root 
      value={formData.unit || ""}
      onValueChange={(value) => setFormData({ ...formData, unit: value })}
    >
      <Select.Trigger
        placeholder={loading ? "Loading..." : "Select Unit"}
        className="w-full"
      />
      <Select.Content>  
        {list.map((unit) => (
          <Select.Item key={unit._id} value={unit.unitName}>
            {unit.unitName}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
       </>

  );
}
