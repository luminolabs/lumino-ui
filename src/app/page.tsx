import { VStack, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <VStack spacing={4} align="center" justify="center" minHeight="calc(100vh - 64px - 56px)">
      <Heading as="h1" size="xl" fontWeight="bold">
        Welcome to Lumino Dashboard
      </Heading>
      <Text fontSize="lg" color="gray.600">
        This is your central dashboard for managing fine-tuning jobs, datasets, and usage.
      </Text>
    </VStack>
  );
}