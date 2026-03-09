"use client";

import { Box, Card, Flex, Heading, Table, Text, Button } from "@radix-ui/themes";
import { Share2, Check, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface ZeroUnitData {
  unit: string;
  sector: string;
}

export default function ZeroUnitPage() {
  const [data, setData] = useState<ZeroUnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ZeroUnitData; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/zerounit`);
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
  }, []);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const handleSort = (key: keyof ZeroUnitData) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof ZeroUnitData }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400 opacity-50 ml-1 inline" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1 inline" /> : <ArrowDown size={14} className="ml-1 inline" />;
  };

  const handleShare = async () => {
    let shareText = 
`🌙✨ *പെരുന്നാൾ പിരിശം – സാഹിത്യോത്സവിനൊപ്പം* ✨🌙

*പിരിശപ്പൊതി* 🎁

📊 *Zero Booking Units*

`;

    if (sortedData.length === 0) {
      shareText += "✨ All units have bookings!\n\n";
    } else {
      // Group by sector for share
      const grouped: Record<string, string[]> = {};
      sortedData.forEach(item => {
        if (!grouped[item.sector]) grouped[item.sector] = [];
        grouped[item.sector].push(item.unit);
      });

      for (const sector in grouped) {
        shareText += `🏢 *${sector || "Unspecified Sector"}*\n`;
        grouped[sector].forEach(unit => {
          shareText += `  📍 ${unit || "Unspecified Unit"}\n`;
        });
        shareText += `\n`;
      }
    }

    shareText += `📦 *Total Zero Units : ${sortedData.length}*

🔗 poonoorsahityotsav.online

©️ Lit Crew – Sahityotsav @ Poonoor
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zero Booking Units",
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

  return (
    <Box>
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">
          Zero Unit Summary
        </Heading>
        <Flex gap="3">
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
                  Sector <SortIcon columnKey="sector" />
                </div>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 -m-1 rounded" onClick={() => handleSort('unit')}>
                  Unit Name <SortIcon columnKey="unit" />
                </div>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sortedData.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={2} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text color="gray">No units found without bookings</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              sortedData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>{item.sector || 'Unspecified'}</Table.RowHeaderCell>
                  <Table.Cell>{item.unit || 'Unspecified'}</Table.Cell>
                </Table.Row>
              ))
            )}
            
            {sortedData.length > 0 && (
              <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                <Table.RowHeaderCell><Text weight="bold">Total Zero Units</Text></Table.RowHeaderCell>
                <Table.Cell><Text weight="bold">{sortedData.length}</Text></Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
}
