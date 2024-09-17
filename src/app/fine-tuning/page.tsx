'use client'

import { Box, Heading, VStack, Button } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import JobList from '@/components/features/fine-tuning/JobList';

export default function FineTuningPage() {
  return (
    <Box maxWidth="800px" margin="0 auto">
      <Heading size="xl" mb={6} color="#261641">Fine-tuning Jobs</Heading>
      <Button 
        leftIcon={<FiPlus />} 
        mb={6}
        bg="#E7E0FD" 
        color="#6B46C1" 
        _hover={{ bg: '#D3C7F2' }}
      >
        Create Job
      </Button>
      <JobList />
    </Box>
  );
}