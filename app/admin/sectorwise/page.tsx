"use client";

import { Box, Card, Flex, Heading, Table, Text, Button } from "@radix-ui/themes";
import { Share2, Check, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface SectorData {
  sector: string;
  totalBookings: number;
  totalOrders: number;
}

export default function SectorWisePage() {
  const [data, setData] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [filterToday, setFilterToday] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SectorData; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/sectorwise${filterToday ? '?today=true' : ''}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterToday]);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: "400px" }}>
        <Text size="4" color="gray">Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" style={{ height: "400px" }}>
        <Text size="4" color="red">{error}</Text>
      </Flex>
    );
  }

  // Calculate totals for footer
  const overallBookings = sortedData.reduce((acc, curr) => acc + curr.totalBookings, 0);
  const overallOrders = sortedData.reduce((acc, curr) => acc + curr.totalOrders, 0);

  const handleSort = (key: keyof SectorData) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof SectorData }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400 opacity-50 ml-1 inline" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1 inline" /> : <ArrowDown size={14} className="ml-1 inline" />;
  };

  const handleShare = async () => {
let shareText = 
`🌙✨ *പെരുന്നാൾ പിരിശം – സാഹിത്യോത്സവിനൊപ്പം* ✨🌙

*പിരിശപ്പൊതി* 🎁

📊 *Sector-Wise Summary*

`;

if (sortedData.length === 0) {
  shareText += "❌ No sectors found.\n";
} else {
  sortedData.forEach(item => {
    shareText += `📍 ${item.sector || "Unspecified"} - ${item.totalOrders}📦\n`;
  });
}

shareText += `
📦 *Total Orders : ${overallOrders}*

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
  // Fallback for browsers that don't support Web Share API
  try {
    await navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
}  
}
  return (
    <Box>
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">
          Sector-Wise Summary
        </Heading>
        <Flex gap="3">
          <Button
            variant={filterToday ? "solid" : "soft"}
            color={filterToday ? "amber" : "gray"}
            onClick={() => setFilterToday(!filterToday)}
            style={{ cursor: "pointer" }}
          >
            {filterToday ? "Showing Today's List" : "Today's List"}
          </Button>

          <Button variant="soft" onClick={handleShare} disabled={data.length === 0}>
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
      </Flex>

      <Card size="2" variant="surface">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort('sector')}>
                  Sector Name <SortIcon columnKey="sector" />
                </div>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                <div className="flex items-center justify-end cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort('totalBookings')}>
                  Total Bookings <SortIcon columnKey="totalBookings" />
                </div>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                <div className="flex items-center justify-end cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort('totalOrders')}>
                  Total Orders <SortIcon columnKey="totalOrders" />
                </div>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sortedData.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text color="gray">No sectors found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              sortedData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>{item.sector || 'Unspecified'}</Table.RowHeaderCell>
                  <Table.Cell align="right">{item.totalBookings}</Table.Cell>
                  <Table.Cell align="right">{item.totalOrders}</Table.Cell>
                </Table.Row>
              ))
            )}
            
            {sortedData.length > 0 && (
              <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                <Table.RowHeaderCell><Text weight="bold">Total</Text></Table.RowHeaderCell>
                <Table.Cell align="right"><Text weight="bold">{overallBookings}</Text></Table.Cell>
                <Table.Cell align="right"><Text weight="bold">{overallOrders}</Text></Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
}
