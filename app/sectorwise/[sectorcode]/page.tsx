"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Heading,
  SegmentedControl,
  TextField,
  Button,
  Box,
  Text,
  Table,
  Card,
  ScrollArea,
  Spinner,
  Flex,
  Badge,
} from "@radix-ui/themes";
import { getSectorNameByCode } from "@/app/lib/sectorCodes";
import { Search, ArrowUp, ArrowDown, Share2, Check } from "lucide-react";

const SortIcon = ({
  field,
  sortConfig,
}: {
  field: string;
  sortConfig: { field: string; order: "asc" | "desc" };
}) => {
  if (sortConfig.field !== field)
    return <ArrowDown size={14} className="ml-1 text-gray-400 opacity-50" />;
  return sortConfig.order === "asc" ? (
    <ArrowUp size={14} className="ml-1" />
  ) : (
    <ArrowDown size={14} className="ml-1" />
  );
};

export default function SectorDetailsPage() {
  const params = useParams();
  const sectorcode = params.sectorcode as string;
  const sectorName = getSectorNameByCode(sectorcode);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [unitData, setUnitData] = useState<any[]>([]);
  const [unitLoading, setUnitLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("all-orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    order: "asc" | "desc";
  }>({ field: "orderCount", order: "desc" });
  const [isCopied, setIsCopied] = useState(false);
  const [filterToday, setFilterToday] = useState(false);

  useEffect(() => {
    if (sectorName) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await fetch(
            `/api/booking?sector=${sectorName}&limit=1000${filterToday ? "&today=true" : ""}`,
          );
          const data = await res.json();
          setOrders(data.data || data.list || []);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      };

      const fetchUnitData = async () => {
        setUnitLoading(true);
        try {
          const res = await fetch(
            `/api/unitwise?sector=${sectorName}${filterToday ? "&today=true" : ""}`,
          );
          const data = await res.json();
          setUnitData(data.data || []);
        } catch (error) {
          console.error("Failed to fetch unit data:", error);
        } finally {
          setUnitLoading(false);
        }
      };

      fetchOrders();
      fetchUnitData();
    }
  }, [sectorName, filterToday]);

  // Handle Share Logic
  const handleShare = async () => {
    let shareText = `🌙✨ *പെരുന്നാൾ പിരിശം – സാഹിത്യോത്സവിനൊപ്പം* ✨🌙\n\n*പിരിശപ്പൊതി* 🎁\n\n`;

    if (activeTab === "all-orders") {
      shareText += `📊 *Bookings List*\n\n`;
      shareText += `📍 *Sector : ${sectorName}*\n\n`;

      if (filteredOrders.length === 0) {
        shareText += "❌ No bookings found.\n";
      } else {
        filteredOrders.forEach((b: any) => {
          shareText += `👤 ${b.name} ${b.unit || ""} - ${b.orderCount}📦\n`;
        });
      }

      const totalOrders = filteredOrders.reduce((acc, b) => acc + (b.orderCount || 0), 0);
      shareText += `\n📦 *Total Orders : ${totalOrders}*\n\n`;
    } else {
      shareText += `📊 *Unit Status*\n\n`;
      shareText += `📍 *Sector : ${sectorName}*\n\n`;

      if (filteredUnits.length === 0) {
        shareText += "❌ No units found.\n";
      } else {
        filteredUnits.forEach((u: any) => {
          shareText += `🏢 ${u.unit} - ${u.totalOrders}📦\n`;
        });
      }

      const totalOrders = unitData.reduce(
        (acc, unit) => acc + (unit.totalOrders || 0),
        0,
      );
      shareText += `\n📦 *Total Orders : ${totalOrders}*\n\n`;
    }

    shareText += `🔗 poonoorsahityotsav.online\n\n©️ Lit Crew – Sahityotsav @ Poonoor`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Sector Data", text: shareText });
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

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
  };

  // Sorting Logic
  const filteredOrders = orders
    .filter((order) => {
      const query = searchQuery.toLowerCase();
      return (
        order.name?.toLowerCase().includes(query) ||
        order.unit?.toLowerCase().includes(query) ||
        order.place?.toLowerCase().includes(query) ||
        (order.phone || order.phoneNumber)?.includes(query)
      );
    })
    .sort((a, b) => {
      let valA = a[sortConfig.field];
      let valB = b[sortConfig.field];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "string" && typeof valB === "string") {
        return sortConfig.order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortConfig.order === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

  const filteredUnits = unitData
    .filter((u) => u.unit?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortConfig.field];
      let valB = b[sortConfig.field];

      // Fallback if sorting by a field that doesn't exist on unitData
      if (valA === undefined) valA = a.totalOrders || 0;
      if (valB === undefined) valB = b.totalOrders || 0;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortConfig.order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortConfig.order === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

  const totalOrdersCount = unitData.reduce(
    (acc, unit) => acc + (unit.totalOrders || 0),
    0,
  );
  const totalBookingsCount = unitData.reduce(
    (acc, unit) => acc + (unit.totalBookings || 0),
    0,
  );

  if (!sectorName)
    return (
      <Container py="9">
        <Heading align="center" color="red">
          Invalid Sector
        </Heading>
      </Container>
    );

  return (
    <Container size="4" py="9" px="4">
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="4">
        <Heading size="8" style={{ textTransform: "capitalize" }}>
          {sectorName} Sector
        </Heading>
        <Flex gap="3" align="center">
          <Badge size="3" color="amber" variant="soft">
            Orders: {totalOrdersCount}
          </Badge>
          <Badge size="3" color="green" variant="soft">
            Bookings: {totalBookingsCount}
          </Badge>
          <Button
            variant="soft"
            onClick={handleShare}
            color={isCopied ? "green" : "blue"}
          >
            {isCopied ? <Check size={16} /> : <Share2 size={16} />}
            {isCopied ? "Copied!" : activeTab === "all-orders" ? "Share List" : "Unit Status"}
          </Button>
        </Flex>
      </Flex>

      <Flex justify="center" mb="6">
        <SegmentedControl.Root
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            // Reset sort correctly when switching tabs
            if (val === "unit-wise") {
              setSortConfig({ field: "totalOrders", order: "desc" });
            } else {
              setSortConfig({ field: "orderCount", order: "desc" });
            }
          }}
        >
          <SegmentedControl.Item value="all-orders">
            All Orders
          </SegmentedControl.Item>
          <SegmentedControl.Item value="unit-wise">
            Unit Wise
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>

      <Flex justify="between" mb="4" gap="4">
        <TextField.Root
          placeholder="Search by name, place, unit..."
          style={{ flexGrow: 1 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <TextField.Slot>
            <Search size={16} />
          </TextField.Slot>
        </TextField.Root>
        <Button
          variant={filterToday ? "solid" : "soft"}
          color={filterToday ? "amber" : "gray"}
          onClick={() => setFilterToday(!filterToday)}
          style={{ cursor: "pointer" }}
        >
          {filterToday ? "Showing Today's List" : "Today's List"}
        </Button>
      </Flex>

      <Card size="3">
        <ScrollArea type="always" style={{ height: 500 }}>
          {ordersLoading || unitLoading ? (
            <Flex align="center" justify="center" p="5">
              <Spinner size="3" />
            </Flex>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>No</Table.ColumnHeaderCell>
                  {activeTab === "all-orders" ? (
                    <>
                      <Table.ColumnHeaderCell>
                        <div
                          className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("name")}
                        >
                          Name <SortIcon field="name" sortConfig={sortConfig} />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        <div
                          className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("place")}
                        >
                          Place{" "}
                          <SortIcon field="place" sortConfig={sortConfig} />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        <div
                          className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("unit")}
                        >
                          Unit <SortIcon field="unit" sortConfig={sortConfig} />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify="center">
                        <div
                          className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("orderCount")}
                        >
                          Orders{" "}
                          <SortIcon
                            field="orderCount"
                            sortConfig={sortConfig}
                          />
                        </div>
                      </Table.ColumnHeaderCell>
                    </>
                  ) : (
                    <>
                      <Table.ColumnHeaderCell>
                        <div
                          className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("unit")}
                        >
                          Unit Name{" "}
                          <SortIcon field="unit" sortConfig={sortConfig} />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify="center">
                        <div
                          className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("totalBookings")}
                        >
                          Total Bookings{" "}
                          <SortIcon
                            field="totalBookings"
                            sortConfig={sortConfig}
                          />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify="center">
                        <div
                          className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded"
                          onClick={() => handleSort("totalOrders")}
                        >
                          Total Orders{" "}
                          <SortIcon
                            field="totalOrders"
                            sortConfig={sortConfig}
                          />
                        </div>
                      </Table.ColumnHeaderCell>
                    </>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(activeTab === "all-orders"
                  ? filteredOrders
                  : filteredUnits
                ).map((item, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    {activeTab === "all-orders" ? (
                      <>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.place}</Table.Cell>
                        <Table.Cell>{item.unit}</Table.Cell>
                        <Table.Cell justify="center">
                          <Badge color="blue">{item.orderCount}</Badge>
                        </Table.Cell>
                      </>
                    ) : (
                      <>
                        <Table.Cell>{item.unit}</Table.Cell>
                        <Table.Cell justify="center">
                          <Badge color="green">{item.totalBookings}</Badge>
                        </Table.Cell>
                        <Table.Cell justify="center">
                          <Badge color="blue">{item.totalOrders}</Badge>
                        </Table.Cell>
                      </>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </ScrollArea>
      </Card>
    </Container>
  );
}
