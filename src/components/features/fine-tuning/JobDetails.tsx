import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, SimpleGrid, Flex, Icon, Button, VStack, Link, HStack } from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { fetchWithAuth } from '@/utils/api';
import { ArrowPathIcon, ArrowPathRoundedSquareIcon, ArrowRightCircleIcon, ArrowsRightLeftIcon, BeakerIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CircleStackIcon, ClockIcon, CpuChipIcon, CubeIcon, CubeTransparentIcon, ForwardIcon, HashtagIcon, HomeIcon, HomeModernIcon, IdentificationIcon, LightBulbIcon, PuzzlePieceIcon, ServerIcon, ServerStackIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

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
    lr: string;
    seed: number;
  }
  timestamps: {
    new: Date;
    queued: Date;
    running: Date;
    stopping: Date;
    stopped: Date;
    completed: Date;
    failed: Date;
  }
  type: string;
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
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
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
        setIsArtifactsLoading(true);
        const data = await fetchWithAuth(`/models/fine-tuned/${jobName}_model`);
        setArtifacts(data.artifacts);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
        if (jobDetails?.status.toLowerCase() === "completed") {
          toast({
            title: 'Error fetching artifacts',
            description: 'Unable to load downloadable files.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setIsArtifactsLoading(false);
      }
    };

    fetchJobDetails();
    fetchArtifacts();
  }, [jobName, toast]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const generateCurlCommand = (url: string) => {
    return `curl -O ${url}`;
  };

  const generateAllWeightsCurlCommand = () => {
    if (!artifacts) return '';
    const commands = artifacts.weight_files.map(file =>
      generateCurlCommand(`${artifacts.base_url}/${file}`)
    );
    return commands.join(' && ');
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
        <Text color="gray.500">No downloadable files available.</Text>
      );
    }

    return (
      <VStack alignItems="flex-start">
        {artifacts.weight_files.map((file) => (
          <HStack key={file} width="50%">
            <Link
              color="#4e00a6"
              href={`${artifacts.base_url}/${file}`}
              isExternal
              flex="1"
            >
              {file}
            </Link>
            <Button
              size="sm"
              onClick={() => copyToClipboard(generateCurlCommand(`${artifacts.base_url}/${file}`), file)}
              leftIcon={copiedStates[file] ? <CheckIcon /> : <CopyIcon />}
              colorScheme="purple"
            >
              {copiedStates[file] ? 'Copied!' : 'Copy curl'}
            </Button>
          </HStack>
        ))}
        <Button
          mt={4}
          onClick={() => copyToClipboard(generateAllWeightsCurlCommand(), 'all')}
          leftIcon={copiedStates['all'] ? <CheckIcon /> : <CopyIcon />}
          colorScheme="purple"
        >
          {copiedStates['all'] ? 'Copied!' : 'Copy curl for all Weights'}
        </Button>
      </VStack>
    );
  };

  const getRuntime = (jobDetails: any) => {
    let timeStamp = ""
    timeStamp = jobDetails.status.toLowerCase() === "running" ? (new Date().getTime() - jobDetails.timestamps?.running?.getTime()).toLocaleString() : jobDetails.status.toLowerCase() === "completed" ? (jobDetails.timestamps?.completed.getTime() - jobDetails.timestamps?.running.getTime()).toLocaleString() : jobDetails.status.toLowerCase() === "stopped"
   ? (jobDetails.timestamps?.stopped.getTime() - jobDetails.timestamps?.running.getTime()).toLocaleString() : jobDetails.status.toLowerCase() === "failed" ? (jobDetails.timestamps?.failed.getTime() - jobDetails.timestamps?.running.getTime()).toLocaleString() : "Job hasn't started yet"

  return timeStamp;
}

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
      <DetailItem icon={ArrowPathIcon} label="Current Epoch / Total Epochs" value={`${jobDetails.current_epoch} / ${jobDetails.total_epochs}`} />
      <DetailItem icon={ArrowRightCircleIcon} label="Current Step / Total Steps" value={`${jobDetails.current_step} / ${jobDetails.total_steps}`} />
      <DetailItem icon={ArrowsRightLeftIcon} label="Shuffle" value={jobDetails.parameters.shuffle.toString()} />
      <DetailItem icon={ServerStackIcon} label="Batch Size" value={jobDetails.parameters.batch_size} />
      <DetailItem icon={CubeTransparentIcon} label="Type of Fine-Tuning" value={jobDetails.type} />
      <DetailItem icon={LightBulbIcon} label="Learning Rate" value={jobDetails.parameters.lr} />
      <DetailItem icon={PuzzlePieceIcon} label="Seed" value={jobDetails.parameters.seed} />
      <DetailItem icon={BeakerIcon} label="Runtime" value={getRuntime(jobDetails) ? getRuntime(jobDetails) : "Job doesn't have timestamps" } />
      {/* <DetailItem icon={CubeTransparentIcon} label="Type of Fine-Tuning" value={jobDetails.parameters.use_qlora.toString() === 'true' ? "qLoRA" : jobDetails.parameters.use_lora.toString() === 'true' ? "LoRA" : "Full"} /> */}
      {/* <DetailItem icon={CubeIcon} label="Use qlora" value={jobDetails.parameters.use_qlora.toString()} /> */}
    </SimpleGrid>
    {isDownloadable && (
      <Box mt={4}>
        <Text fontWeight="bold" mb={2}>Downloads</Text>
        {renderDownloadButtons()}
      </Box>
    )}
  </Box>
);
};

export default JobDetails;