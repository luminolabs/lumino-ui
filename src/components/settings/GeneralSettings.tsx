import { VStack, Heading, HStack, Text, Button, Box } from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';

const BillingSettings = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="#261641">Billing</Heading>
      <HStack>
        <FiDollarSign />
        <Text fontWeight="bold" color="#261641">Credits Left:</Text>
        <Text color="#261641">$100</Text>
      </HStack>
      <Box>
        <Button colorScheme="purple" bg="#E7E0FD" color="#6B46C1" _hover={{ bg: '#D3C7F2' }}>
          Add Credits
        </Button>
      </Box>
      <Box>
        <Button variant="link" color="#6B46C1">Update Billing</Button>
      </Box>
    </VStack>
  );
};

export default BillingSettings;