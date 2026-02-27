"use client";

import { Box, Card, Flex, Heading, Table, Text, Button } from "@radix-ui/themes";
import { Share2, Check } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sectorwise");
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
  const overallBookings = data.reduce((acc, curr) => acc + curr.totalBookings, 0);
  const overallOrders = data.reduce((acc, curr) => acc + curr.totalOrders, 0);

  const handleShare = async () => {
let shareText = 
`🌙✨ *പെരുന്നാൾ പിരിശം – സാഹിത്യോത്സവിനൊപ്പം* ✨🌙

*പിരിശപ്പൊതി* 🎁

📊 *Sector-Wise Summary*

`;

if (data.length === 0) {
  shareText += "❌ No sectors found.\n";
} else {
  data.forEach(item => {
    shareText += `📍 ${item.sector || "Unspecified"} : B-${item.totalBookings} | O-${item.totalOrders}\n`;
  });
}

shareText += `
✅ *Total Bookings : ${overallBookings}*
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

      <Card size="2" variant="surface">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Sector Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Total Bookings</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Total Orders</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text color="gray">No sectors found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>{item.sector || 'Unspecified'}</Table.RowHeaderCell>
                  <Table.Cell align="right">{item.totalBookings}</Table.Cell>
                  <Table.Cell align="right">{item.totalOrders}</Table.Cell>
                </Table.Row>
              ))
            )}
            
            {data.length > 0 && (
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
