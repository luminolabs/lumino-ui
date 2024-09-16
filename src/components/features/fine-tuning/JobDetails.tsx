'use client'

import { Box, Heading, VStack, HStack, Text } from '@chakra-ui/react';
import { FiCheck, FiCpu, FiBox, FiClock, FiHash, FiRepeat, FiGrid, FiZap, FiDatabase } from 'react-icons/fi';
import Icon from '@/components/common/Icon';

const JobDetails = ({ jobId }: { jobId: string }) => {
  const details = [
    { icon: FiCheck, label: 'Status', value: 'Success' },
    { icon: FiCpu, label: 'Base Model', value: 'llama 3.1.8b' },
    { icon: FiBox, label: 'Output Model', value: 'llama 3.1.8b-job-id' },
    { icon: FiClock, label: 'Created At', value: '9/23/2024, 3:27pm' },
    { icon: FiHash, label: 'Trained Tokens', value: '4,844' },
    { icon: FiRepeat, label: 'Epochs', value: '1' },
    { icon: FiGrid, label: 'Batch Size', value: '2' },
    { icon: FiZap, label: 'LR Multiplier', value: '4' },
    { icon: FiDatabase, label: 'Dataset', value: 'mathinstruct.jsonl' },
  ];

  return (
    <Box flex={1} pl={4}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Job {jobId}</Heading>
        {details.map((detail, index) => (
          <HStack key={index} spacing={4}>
            <Icon as={detail.icon} color="purple.500" />
            <Text fontWeight="bold" width="120px">{detail.label}</Text>
            <Text>{detail.value}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default JobDetails;