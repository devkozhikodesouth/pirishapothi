"use client";

import {
  Box,
  Flex,
  Select,
  Text,
  Table,
  Button,
} from "@radix-ui/themes";
import { ArrowUp, ArrowDown, ArrowUpDown, Share2, Check } from "lucide-react";
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
  const [sortConfig, setSortConfig] = useState<{ field: string; order: "asc" | "desc" } | null>({ field: "createdAt", order: "desc" });
  const [isCopied, setIsCopied] = useState(false);

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
        sortField: sortConfig?.field,
        sortOrder: sortConfig?.order,
      })
    );
  }, [dispatch, page, searchQuery, sector, unit, sortConfig]);

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

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
    dispatch(setPage(1));
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig?.field !== field) return <ArrowUpDown size={14} className="text-gray-400 opacity-50 ml-1 inline" />;
    return sortConfig.order === "asc" ? <ArrowUp size={14} className="ml-1 inline" /> : <ArrowDown size={14} className="ml-1 inline" />;
  };

  const handleShare = async () => {
    let shareText = 
`🌙✨ *പെരുന്നാൾ പിരിശം – സാഹിത്യോത്സവിനൊപ്പം* ✨🌙

*പിരിശപ്പൊതി* 🎁

📊 *Bookings List*


`;
if(sector !== "all"){
  shareText += `📍 *Sector : ${sector}*\n`;
}
if(unit !== "all"){
  shareText += `📍 *Unit : ${unit}*\n\n`;
}

    if (list.length === 0) {
      shareText += "❌ No bookings found.\n";
    } else {
      list.forEach((b: any) => {
        shareText += `👤 ${b.name} ${b.place} - ${b.orderCount}\n`;
      });
    }

    const pageBookings = list.length;
    const pageOrders = list.reduce((acc: any, b: any) => acc + b.orderCount, 0);

    shareText += `
✅ *Page Bookings : ${pageBookings}*
📦 *Page Orders : ${pageOrders}*

🔗 poonoorsahityotsav.online

©️ Lit Crew – Sahityotsav @ Poonoor
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "",
          text: shareText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }  
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

        <Button variant="soft" onClick={handleShare} disabled={list.length === 0}>
          {isCopied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Share2 size={16} /> Share List
            </>
          )}
        </Button>
      </Flex>

      {/* TABLE */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort("name")}>
                Name <SortIcon field="name" />
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort("place")}>
                Place <SortIcon field="place" />
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort("orderCount")}>
                Order Count <SortIcon field="orderCount" />
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort("sector")}>
                Sector <SortIcon field="sector" />
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort("unit")}>
                Unit <SortIcon field="unit" />
              </div>
            </Table.ColumnHeaderCell>
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