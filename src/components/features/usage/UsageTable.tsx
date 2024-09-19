import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Spinner } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';

interface UsageTableProps {
  dataType: 'cost' | 'activity';
  dateRange: { startDate: Date; endDate: Date };
}

interface UsageData {
  date: string;
  value: number;
}

const UsageTable: React.FC<UsageTableProps> = ({ dataType, dateRange }) => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const endpoint = dataType === 'cost' ? '/usage/total-cost' : '/usage/records';
      const params = new URLSearchParams({
        start_date: dateRange.startDate.toISOString().split('T')[0],
        end_date: dateRange.endDate.toISOString().split('T')[0],
      });
      
      try {
        const response = await fetchWithAuth(`${endpoint}?${params}`);
        if (dataType === 'cost') {
          setUsageData([{ date: response.end_date, value: parseFloat(response.total_cost) }]);
        } else {
          setUsageData(response.data.map((item: any) => ({
            date: item.created_at.split('T')[0],
            value: parseFloat(item.usage_amount)
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataType, dateRange]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="gray.500" fontSize="sm" fontWeight="medium" pb={4}>DATE</Th>
            <Th color="gray.500" fontSize="sm" fontWeight="medium" isNumeric pb={4}>{dataType === 'cost' ? 'COST' : 'USAGE'}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usageData.map((data, index) => (
            <Tr key={index}>
              <Td color="gray.500" borderBottom="1px" borderColor="gray.200" py={4}>{data.date}</Td>
              <Td color="gray.500" borderBottom="1px" borderColor="gray.200" isNumeric py={4}>{data.value.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UsageTable;