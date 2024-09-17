import { VStack, Button } from '@chakra-ui/react';
import { FiSettings, FiCreditCard, FiKey, FiUsers } from 'react-icons/fi';

const SettingsSidebar = () => {
  return (
    <VStack align="stretch" width="200px" spacing={2}>
      <Button leftIcon={<FiSettings />} justifyContent="flex-start" variant="ghost" bg="purple.100" color="purple.700">
        General
      </Button>
      <Button leftIcon={<FiCreditCard />} justifyContent="flex-start" variant="ghost">
        Billing
      </Button>
      <Button leftIcon={<FiKey />} justifyContent="flex-start" variant="ghost">
        API Keys
      </Button>
      <Button leftIcon={<FiUsers />} justifyContent="flex-start" variant="ghost">
        Team
      </Button>
    </VStack>
  );
};

export default SettingsSidebar;