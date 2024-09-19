import React from 'react';
import { Button, HStack } from '@chakra-ui/react';

interface Tab {
  label: string;
  value: string;
}

interface CustomTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <HStack spacing={2}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          bg={activeTab === tab.value ? "purple.100" : "transparent"}
          color={activeTab === tab.value ? "purple.700" : "gray.600"}
          _hover={{ bg: "purple.50" }}
          fontWeight="normal"
          borderRadius="full"
        >
          {tab.label}
        </Button>
      ))}
    </HStack>
  );
};

export default CustomTabs;