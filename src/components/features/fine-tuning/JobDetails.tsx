'use client'

import { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';

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
  const columns = useBreakpointValue({ base: 1, md: 2 });

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

  const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <GridItem>
      <Text fontWeight="semibold" color="gray.600">{label}</Text>
      <Text color="gray.900">{value}</Text>
    </GridItem>
  );

  return (
    <Box>
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
        <DetailItem label="Name" value={jobDetails.name} />
        <DetailItem label="Status" value={jobDetails.status} />
        <DetailItem label="Base Model" value={jobDetails.base_model_name} />
        <DetailItem label="Created At" value={new Date(jobDetails.created_at).toLocaleString()} />
        <DetailItem label="Current Epoch" value={jobDetails.current_epoch} />
        <DetailItem label="Current Step" value={jobDetails.current_step} />
        <DetailItem label="Dataset Name" value={jobDetails.dataset_name} />
        <DetailItem label="Metrics" value={jobDetails.metrics} />
        <DetailItem label="Number of Tokens" value={jobDetails.num_tokens} />
        <DetailItem label="Number of Epochs" value={jobDetails.parameters.num_epochs} />
        <DetailItem label="Shuffle" value={jobDetails.parameters.shuffle.toString()} />
        <DetailItem label="Batch Size" value={jobDetails.parameters.batch_size} />
        <DetailItem label="Use lora" value={jobDetails.parameters.use_lora.toString()} />
        <DetailItem label="Use qlora" value={jobDetails.parameters.use_qlora.toString()} />
        <DetailItem label="Total Epochs" value={jobDetails.total_epochs} />
        <DetailItem label="Total Steps" value={jobDetails.total_steps} />
      </Grid>
    </Box>
  );
};

export default JobDetails;