import { VStack, Heading, Button, Box, Text } from '@chakra-ui/react';
import { FiPlus } from "react-icons/fi";
import Link from 'next/link';

const JobList = () => {
  const jobs = ['Job 1', 'Job 2', 'Job 3', 'Job 4', 'Job 1', 'Job 2', 'Job 3', 'Job 4'];

  return (
    <Box width="300px" pr={4}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Fine-tuning Jobs</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="purple">
          Create Job
        </Button>
        <VStack align="stretch" spacing={2}>
          {jobs.map((job, index) => (
            <Link key={index} href={`/fine-tuning/${index + 1}`} passHref>
              <Box p={2} bg="purple.50" borderRadius="md" cursor="pointer">
                <Text>{job}</Text>
                {index === 0 && <Text fontSize="sm" color="gray.500">9/23/2024, 3:27pm</Text>}
              </Box>
            </Link>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default JobList;