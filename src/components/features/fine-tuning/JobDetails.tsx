import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, SimpleGrid, Flex, Icon, Button, VStack } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { fetchWithAuth } from '@/utils/api';
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CircleStackIcon, ClockIcon, CpuChipIcon, CubeIcon, CubeTransparentIcon, ForwardIcon, HashtagIcon, HomeIcon, HomeModernIcon, IdentificationIcon, ServerIcon, ServerStackIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

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

interface Artifacts {
  base_url: string;
  weight_files: string[];
  other_files: string[];
}

const JobDetails = ({ jobName }: { jobName: string }) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [artifacts, setArtifacts] = useState<Artifacts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isArtifactsLoading, setIsArtifactsLoading] = useState(true);
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

    const fetchArtifacts = async () => {
      if (!jobName) return;
      try {
        if (jobDetails?.status.toLocaleLowerCase() === "completed") {
          setIsArtifactsLoading(true);
          const data = await fetchWithAuth(`/models/fine-tuned/${jobName}_model`);
          setArtifacts(data.artifacts);
        }
      } catch (error) {
        console.error('Error fetching artifacts:', error);
        toast({
          title: 'Error fetching artifacts',
          description: 'Unable to load downloadable files.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsArtifactsLoading(false);
      }
    };

    fetchJobDetails();
    fetchArtifacts();
  }, [jobName, toast]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

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

  if (isLoading) {
    return <Spinner />;
  }

  if (!jobDetails) {
    return <Text>Job not found</Text>;
  }

  const isDownloadable = jobDetails.status.toLowerCase() === 'completed';

  const renderDownloadButtons = () => {
    if (isArtifactsLoading) {
      return <Spinner />;
    }

    if (!artifacts || (!artifacts.weight_files.length && !artifacts.other_files.length)) {
      return (
        <Button
          leftIcon={<DownloadIcon />}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          isDisabled={true}
          width="100%"
        >
          Download
        </Button>
      );
    }

    const allFiles = [...artifacts.weight_files, ...artifacts.other_files];

    return (
      <SimpleGrid columns={3} spacing={2}>
        {allFiles.map((file) => (
          <Button
            key={file}
            leftIcon={<DownloadIcon />}
            color="white"
            bg="#4e00a6"
            _hover={{ bg: "#0005A6" }}
            onClick={() => handleDownload(`${artifacts!.base_url}/${file}`)}
            size="sm"
            height="auto"
            whiteSpace="normal"
            py={2}
          >
            {file}
          </Button>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        <DetailItem icon={IdentificationIcon} label="Name" value={jobDetails.name} />
        <DetailItem icon={CheckCircleIcon} label="Status" value={jobDetails.status} color={getStatusColor(jobDetails.status)} />
        <DetailItem icon={HomeIcon} label="Base Model" value={jobDetails.base_model_name} />
        <DetailItem icon={HomeModernIcon} label="Output Model" value={jobDetails.base_model_name + "_" + jobDetails.id} />
        <DetailItem icon={ClockIcon} label="Created At" value={new Date(jobDetails.created_at).toLocaleString()} />
        <DetailItem icon={CircleStackIcon} label="Dataset Name" value={jobDetails.dataset_name} />
        <DetailItem icon={HashtagIcon} label="Number of Tokens" value={jobDetails.num_tokens?.toLocaleString() || 'N/A'} />
        <DetailItem icon={ArrowPathIcon} label="Number of Epochs" value={jobDetails.parameters.num_epochs} />
        <DetailItem icon={ArrowsRightLeftIcon} label="Shuffle" value={jobDetails.parameters.shuffle.toString()} />
        <DetailItem icon={ServerStackIcon} label="Batch Size" value={jobDetails.parameters.batch_size} />
        <DetailItem icon={CubeTransparentIcon} label="Type of finetuning" value={jobDetails.parameters.use_lora.toString() === 'true' ? "lora" : "qlora"} />
        {/* <DetailItem icon={CubeIcon} label="Use qlora" value={jobDetails.parameters.use_qlora.toString()} /> */}
      </SimpleGrid>
      {isDownloadable ? (
        <Box mt={4}>
          <Text fontWeight="bold" mb={2}>Downloads</Text>
          {renderDownloadButtons()}
        </Box>
      ) : <Box mt={4}>
        <Text fontWeight="bold" mb={2}>Downloads</Text>
        <Button
          leftIcon={<DownloadIcon />}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          isDisabled={true}
          width="20%"
        >
          Download
        </Button>
      </Box>}
    </Box>
  );
};

export default JobDetails;