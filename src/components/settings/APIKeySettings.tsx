import { VStack, Heading, Button, Input, InputGroup, InputRightElement, Box, Text } from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';

const APIKeySettings = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="#261641">API Keys</Heading>
      <Box>
        <Button colorScheme="purple" bg="#E7E0FD" color="#6B46C1" _hover={{ bg: '#D3C7F2' }}>
          Create API Key
        </Button>
      </Box>
      <Box>
        <Text bg="#F8F9FA" p={2} borderRadius="md" fontFamily="monospace">
          sk********************************f
        </Text>
      </Box>
    </VStack>
  );
};

export default APIKeySettings;