"use client";

import { Select } from "@radix-ui/themes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits } from "@/app/redux/Slice/unitSlice";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { ErrorText } from "../components/ErrorText";

export default function RadixSelect({
  formData,
  setFormData,
  errorMsg
}: {
  formData: any;
  setFormData: any;
  errorMsg:  string
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
        size={'3'}
      value={formData.sector==='others' ? setFormData({ ...formData, unit: "others" }): formData.unit || ""}
      onValueChange={(value) => setFormData({ ...formData, unit: value })}
    >
      <Select.Trigger
        placeholder={loading ? "Loading..." : "Select Unit"}
        className="w-full"
        style={{
            backgroundColor: "#FFFDF8",
            border: "1px solid #E6C7A8",
          }}
      />
      <Select.Content color="brown">  
        {list.map((unit) => (
          <Select.Item key={unit._id} value={unit.unitName}>
            {unit.unitName}
          </Select.Item>
        ))}
      </Select.Content> 
    </Select.Root>
    <ErrorText msg={errorMsg} />
       </>

  );
}
