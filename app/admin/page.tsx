"use client";

import {
  Box,
  Flex,
  Select,
  Text,
  Table,
  Button,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/redux/store/store";
import { fetchBookings, setPage } from "@/app/redux/Slice/getBookingSlice";
import { fetchSectors } from "@/app/redux/Slice/sectorSlice";
import { fetchUnits } from "@/app/redux/Slice/unitSlice";
import { useDebouncedCallback } from "use-debounce";

export default function BookingsTable({ setTotalCount }: any) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Bookings State
  const { list, loading, page, pages, total } = useSelector(
    (state: RootState) => state.getBooking
  );

  // Sector and Unit Lists
  const { list: sectorList } = useSelector((state: RootState) => state.sector);
  const { list: unitList } = useSelector((state: RootState) => state.unit);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [unit, setUnit] = useState("all");

  // Fetch initial sectors
  useEffect(() => {
    dispatch(fetchSectors());
  }, [dispatch]);

  // Fetch units when sector changes
  useEffect(() => {
    if (sector && sector !== "all") {
      dispatch(fetchUnits(sector));
    }
  }, [dispatch, sector]);

  // Fetch bookings whenever filters or page changes
  useEffect(() => {
    dispatch(
      fetchBookings({
        page,
        search: searchQuery,
        sector: sector === "all" ? "" : sector,
        unit: unit === "all" ? "" : unit,
      })
    );
  }, [dispatch, page, searchQuery, sector, unit]);

  // Debounced search for Place
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    dispatch(setPage(1));
  }, 500);

  const handleSectorChange = (value: string) => {
    setSector(value);
    setUnit("all"); // Reset unit when sector changes
    dispatch(setPage(1));
  };

  const handleUnitChange = (value: string) => {
    setUnit(value);
    dispatch(setPage(1));
  };

  return (
    <Box>
      {/* FILTERS */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Select.Root value={sector} onValueChange={handleSectorChange}>
          <Select.Trigger placeholder="Sector" />
          <Select.Content>
            <Select.Item value="all">All Sectors</Select.Item>
            {sectorList.map((s: any) => (
              <Select.Item key={s._id} value={s.sectorName}>
                {s.sectorName}
              </Select.Item>
            ))}
            <Select.Item value="others">Others</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root 
          value={unit} 
          onValueChange={handleUnitChange}
          disabled={sector === "all" || sector==='others'}
        >
          <Select.Trigger placeholder="Unit" />
          <Select.Content>
            <Select.Item value="all" disabled={sector === "all" || sector==='others'}>
              {sector === "all" ? "Select Sector first" : "All Units"}
            </Select.Item>
            {unitList.map((u: any) => (
              <Select.Item key={u._id} value={u.unitName}>
                {u.unitName}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <input
          placeholder="Search name, phone, or place"
          className="border border-(--gray-a7) bg-(--color-surface) px-3 py-1.5 rounded-(--radius-3) text-sm shadow-sm placeholder:text-(--gray-a10) focus:outline-none focus:border-(--accent-a8) focus:ring-1 focus:ring-(--accent-a8) transition-all"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchQuery}
        />
      </Flex>

      {/* TABLE */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Place</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Order Count</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sector</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {list.map((b: any) => (
            <Table.Row key={b._id}>
              <Table.Cell>{b.name}</Table.Cell>
              <Table.Cell>{b.phone}</Table.Cell>
              <Table.Cell>{b.place}</Table.Cell>
              <Table.Cell>{b.orderCount}</Table.Cell>
              <Table.Cell>{b.sector}</Table.Cell>
              <Table.Cell>{b.unit}</Table.Cell>
            </Table.Row>
          ))}

          {!loading && list.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Text align="center" style={{ display: 'block', padding: '20px' }}>No results found</Text>
              </Table.Cell>
            </Table.Row>
          )}

          {loading && list.length === 0 && (
             <Table.Row>
              <Table.Cell colSpan={6}>
                <Text align="center" style={{ display: 'block', padding: '20px' }} color="gray">Loading...</Text>
              </Table.Cell>
             </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {/* PAGINATION */}
      <Flex justify="between" align="center" mt="4">
        <Button
          disabled={page === 1 || loading || total === 0}
          onClick={() => dispatch(setPage(page - 1))}
          variant="soft"
        >
          Previous
        </Button>

        <Text size="2" color="gray">
          {total > 0 ? `Page ${page} of ${pages} (${total} total)` : "No bookings"}
        </Text>

        <Button
          disabled={page === pages || loading || total === 0}
          onClick={() => dispatch(setPage(page + 1))}
          variant="soft"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}