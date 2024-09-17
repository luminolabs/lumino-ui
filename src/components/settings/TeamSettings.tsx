import { VStack, Heading, HStack, Button, Text, Badge, Box } from '@chakra-ui/react';
import { FiUserPlus, FiX } from 'react-icons/fi';

const TeamSettings = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="#261641">Team</Heading>
      <Box alignSelf="flex-end">
        <Button leftIcon={<FiUserPlus />} colorScheme="green" size="sm">
          Invite User
        </Button>
      </Box>
      <Box bg="#F8F9FA" p={3} borderRadius="md">
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="#261641">John Doe</Text>
            <Text fontSize="sm" color="gray.500">john@email.com</Text>
          </VStack>
          <HStack>
            <Badge colorScheme="purple" bg="#E7E0FD" color="#6B46C1">ADMIN</Badge>
            <Button size="sm" colorScheme="red" leftIcon={<FiX />}>Remove</Button>
          </HStack>
        </HStack>
      </Box>
    </VStack>
  );
};

export default TeamSettings;