'use client'

import { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, Grid, GridItem, useBreakpointValue, HStack, Icon, VStack, Flex, SimpleGrid } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CircleStackIcon, ClockIcon, CpuChipIcon, CubeIcon, CubeTransparentIcon, ForwardIcon, HashtagIcon, IdentificationIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

interface JobDetail {
  id: string;
  base_model_name: string;
  created_at: string;
  name: string;
  current_epoch: number;
  current_step: number;
  dataset_name: string;
  metrics: any;
  num_tokens: number;
  parameters: {
    batch_size: number;
    shuffle: boolean;
    use_lora: boolean;
    use_qlora: boolean;
    num_epochs: number;
  }
  status: string;
  total_epochs: number;
  total_steps:number;
}

const JobDetails = ({ jobName }: { jobName: string }) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobName) return;
      try {
        setIsLoading(true);
        const data = await fetchWithAuth(`/fine-tuning/${jobName}`);
        setJobDetails(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          title: 'Error fetching job details',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobName, toast]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!jobDetails) {
    return <Text>Job not found</Text>;
  }

  const DetailItem = ({ icon, label, value, color = "gray.600" }: { icon: React.ElementType; label: string; value: string | number; color?: string }) => (
    <Flex align="center" py={2}>
      <Icon as={icon} boxSize={5} color={color} mr={3} />
      <Box>
        <Text fontSize="xs" fontWeight="medium" color="gray.500">{label}</Text>
        <Text fontSize="sm" fontWeight="semibold" color={color}>{value}</Text>
      </Box>
    </Flex>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'blue.500';
      case 'running': return 'green.500';
      case 'completed': return 'purple.500';
      case 'failed': return 'red.500';
      default: return 'gray.500';
    }
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        <DetailItem icon={IdentificationIcon} label="Name" value={jobDetails.name} />
        <DetailItem icon={CheckCircleIcon} label="Status" value={jobDetails.status} color={getStatusColor(jobDetails.status)} />
        <DetailItem icon={CpuChipIcon} label="Base Model" value={jobDetails.base_model_name} />
        <DetailItem icon={CalendarIcon} label="Created At" value={new Date(jobDetails.created_at).toLocaleString()} />
        <DetailItem icon={ClockIcon} label="Current Epoch" value={jobDetails.current_epoch || 'N/A'} />
        <DetailItem icon={ArrowPathIcon} label="Current Step" value={jobDetails.current_step || 'N/A'} />
        <DetailItem icon={CircleStackIcon} label="Dataset Name" value={jobDetails.dataset_name} />
        <DetailItem icon={ChartBarIcon} label="Metrics" value={jobDetails.metrics || 'N/A'} />
        <DetailItem icon={HashtagIcon} label="Number of Tokens" value={jobDetails.num_tokens?.toLocaleString() || 'N/A'} />
        <DetailItem icon={ArrowPathRoundedSquareIcon} label="Number of Epochs" value={jobDetails.parameters.num_epochs} />
        <DetailItem icon={ArrowsRightLeftIcon} label="Shuffle" value={jobDetails.parameters.shuffle.toString()} />
        <DetailItem icon={ViewColumnsIcon} label="Batch Size" value={jobDetails.parameters.batch_size} />
        <DetailItem icon={CubeTransparentIcon} label="Use lora" value={jobDetails.parameters.use_lora.toString()} />
        <DetailItem icon={CubeIcon} label="Use qlora" value={jobDetails.parameters.use_qlora.toString()} />
        <DetailItem icon={ArrowPathRoundedSquareIcon} label="Total Epochs" value={jobDetails.total_epochs || 'N/A'} />
        <DetailItem icon={ForwardIcon} label="Total Steps" value={jobDetails.total_steps || 'N/A'} />
      </SimpleGrid>
    </Box>
  );
};

export default JobDetails;