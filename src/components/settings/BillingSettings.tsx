import { VStack, Heading, HStack, Text, Button } from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';

const BillingSettings = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Billing</Heading>
      <HStack>
        <FiDollarSign />
        <Text fontWeight="bold">Credits Left:</Text>
        <Text>$100</Text>
      </HStack>
      <Button colorScheme="purple" width="fit-content">Add Credits</Button>
      <Button variant="link" color="purple.500">Update Billing</Button>
    </VStack>
  );
};

export default BillingSettings;