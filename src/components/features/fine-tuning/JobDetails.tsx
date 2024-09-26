import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, SimpleGrid, Flex, Icon, Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
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
  total_steps: number;
}

const JobDetails = ({ jobName }: { jobName: string }) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleDownloadWeights = async () => {
    setIsDownloading(true);
    try {
      const data = await fetchWithAuth(`/models/fine-tuned/${jobName}`);
      if (data.artifacts && data.artifacts.base_url) {
        window.open(data.artifacts.base_url, '_blank');
      } else {
        toast({
          title: "Download failed",
          description: "Could not find download URL for weights",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error downloading weights:', error);
      toast({
        title: "Download failed",
        description: "An error occurred while trying to download weights",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

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

  const isDownloadable = jobDetails.status.toLowerCase() === 'completed' || jobDetails.status.toLowerCase() === 'failed';

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
      <Flex justifyContent="flex-start" mt={4}>
        <Button
          leftIcon={<DownloadIcon />}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          onClick={handleDownloadWeights}
          isLoading={isDownloading}
          loadingText="Downloading..."
          isDisabled={!isDownloadable}
        >
          Download Weights
        </Button>
      </Flex>
    </Box>
  );
};

export default JobDetails;