// src/app/usage/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex, HStack, VStack } from '@chakra-ui/react';
import UsageTable from '@/components/features/usage/UsageTable';
import SimpleDateRangePicker from '@/components/features/usage/SimpleDateRangePicker';
import CustomTabs from '@/components/features/usage/CustomTabs';
import { fetchWithAuth } from '@/utils/api';

export default function Usage() {
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [activeTab, setActiveTab] = useState<'cost' | 'activity'>('cost');
  const [usageData, setUsageData] = useState<any[]>([]);

  const fetchUsageData = async () => {
    const endpoint = activeTab === 'cost' ? '/usage/total-cost' : '/usage/records';
    const params = new URLSearchParams({
      start_date: dateRange.startDate.toISOString().split('T')[0],
      end_date: dateRange.endDate.toISOString().split('T')[0],
    });

    try {
      const response = await fetchWithAuth(`${endpoint}?${params}`);
      if (activeTab === 'cost') {
        setUsageData([{ date: response.end_date, value: parseFloat(response.total_cost) }]);
      } else {
        setUsageData(response.data.map((item: any) => ({
          date: item.created_at.split('T')[0],
          value: parseFloat(item.usage_amount)
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, [dateRange, activeTab]);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <Box p={6} bg="white" minH="calc(100vh - 64px)">
      <VStack align="stretch" spacing={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading size="lg" color="#1A202C">Usage</Heading>
          <SimpleDateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </Flex>
        <CustomTabs
          tabs={[
            { label: 'Cost', value: 'cost' },
            { label: 'Activity', value: 'activity' }
          ]}
          activeTab={activeTab}
          onChange={(value) => setActiveTab(value as 'cost' | 'activity')}
        />
        <UsageTable dataType={activeTab} data={usageData} />
      </VStack>
    </Box>
  );
}