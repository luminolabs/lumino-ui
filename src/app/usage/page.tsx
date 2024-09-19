'use client'

import React, { useState } from 'react';
import { Box, Heading, Flex, Button, HStack } from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';
import UsageTable from '@/components/features/usage/UsageTable';
import CustomDateRangePicker from '@/components/features/usage/CustomDateRangePicker';
import CustomTabs from '@/components/features/usage/CustomTabs';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export default function Usage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [activeTab, setActiveTab] = useState<'cost' | 'activity'>('cost');

  return (
    <Box p={6} bg="white" minH="calc(100vh - 64px)">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="#1A202C">Usage</Heading>
        <CustomDateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </Flex>
      <HStack spacing={4} mb={6}>
        <CustomTabs
          tabs={[
            { label: 'Cost', value: 'cost' },
            { label: 'Activity', value: 'activity' }
          ]}
          activeTab={activeTab}
          onChange={(value) => setActiveTab(value as 'cost' | 'activity')}
        />
      </HStack>
      <UsageTable dataType={activeTab} dateRange={dateRange} />
      <Flex justify="flex-end" mt={6}>
        <Button 
          leftIcon={<FiDollarSign />} 
          bg="purple.100" 
          color="purple.700" 
          _hover={{ bg: "purple.200" }}
          fontWeight="normal"
        >
          Add Credits
        </Button>
      </Flex>
    </Box>
  );
}