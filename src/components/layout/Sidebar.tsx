'use client'

import { VStack, Button } from '@chakra-ui/react';
import { FiCpu, FiDatabase, FiBarChart2 } from 'react-icons/fi';
import Icon from '@/components/common/Icon';

const Sidebar = () => {
  return (
    <VStack align="stretch" width="200px" p={4} bg="gray.100" height="100vh">
      <Button leftIcon={<Icon as={FiCpu} />} justifyContent="flex-start" bg="purple.100" color="purple.700">
        Fine-tuning
      </Button>
      <Button leftIcon={<Icon as={FiDatabase} />} justifyContent="flex-start" variant="ghost">
        Datasets
      </Button>
      <Button leftIcon={<Icon as={FiBarChart2} />} justifyContent="flex-start" variant="ghost">
        Usage
      </Button>
    </VStack>
  );
};

export default Sidebar;