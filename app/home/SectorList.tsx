"use client";

import { Select } from "@radix-ui/themes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectors } from "@/app/redux/Slice/sectorSlice";
import { RootState, AppDispatch } from "@/app/redux/store/store";

export default function RadixSelect({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading,error } = useSelector((state: RootState) => state.sector);
console.log(list)
  useEffect(() => {
    dispatch(fetchSectors());
  }, [dispatch]);

  return (
    <>


    <Select.Root
      value={formData.sector || ""}
      onValueChange={(value) => setFormData({ ...formData, sector: value,unit:"" })}
    >
      <Select.Trigger
        placeholder={loading ? "Loading..." : "Select Sector"}
        className="w-full"
      />
      <Select.Content>
        {list.map((sector) => (
          <Select.Item key={sector._id} value={sector.sectorName}>
            {sector.sectorName}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
    
       </>

  );
}
