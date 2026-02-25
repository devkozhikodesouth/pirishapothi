"use client";

import { Select } from "@radix-ui/themes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectors } from "@/app/redux/Slice/sectorSlice";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { ErrorText } from "../components/ErrorText";

export default function RadixSelect({
  formData,
  setFormData,
  errorMsg,
}: {
  formData: any;
  setFormData: any;
  errorMsg: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.sector,
  );
  console.log(list);
  useEffect(() => {
    dispatch(fetchSectors());
  }, [dispatch]);

  return (
    <>
      <Select.Root
        size={"3"}
        value={formData.sector || ""}
        onValueChange={(value) =>
          setFormData((prev: any) => ({
            ...prev,
            sector: value,
            unit: value === "others" ? "others" : "",
          }))
        }
      >
        <Select.Trigger
          placeholder={loading ? "Loading..." : "Select Sector"}
          className="w-full"
          style={{
            backgroundColor: "#FFFDF8",
            border: "1px solid #E6C7A8",
          }}
        />
        <Select.Content color="brown">
          {list.map((sector) => (
            <Select.Item key={sector._id} value={sector.sectorName}>
              {sector.sectorName}
            </Select.Item>
          ))}
          <Select.Item value="others">Others</Select.Item>
        </Select.Content>
      </Select.Root>
      <ErrorText msg={errorMsg} />
    </>
  );
}
