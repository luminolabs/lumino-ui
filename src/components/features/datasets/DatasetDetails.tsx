'use client'

import { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';

interface DatasetDetails {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  name: string;
  description: string;
  file_name: string;
  file_size: number;
  errors: string;
}

const DatasetDetails = ({ datasetName }: { datasetName: string }) => {
  const [datasetDetails, setDatasetDetails] = useState<DatasetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const columns = useBreakpointValue({ base: 1, md: 2 });

  useEffect(() => {
    const fetchDatasetDetails = async () => {
      if (!datasetName) return;
      try {
        setIsLoading(true);
        const data = await fetchWithAuth(`/datasets/${datasetName}`);
        setDatasetDetails(data);
      } catch (error) {
        console.error('Error fetching dataset details:', error);
        toast({
          title: 'Error fetching dataset details',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasetDetails();
  }, [datasetName, toast]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!datasetDetails) {
    return <Text>Dataset not found</Text>;
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
        <DetailItem label="Id" value={datasetDetails.id} />
        <DetailItem label="Status" value={datasetDetails.status} />
        <DetailItem label="Name" value={datasetDetails.name} />
        <DetailItem label="Created At" value={new Date(datasetDetails.created_at).toLocaleString()} />
        <DetailItem label="Last Updated" value={new Date(datasetDetails.updated_at).toLocaleString()} />
        <DetailItem label="Description" value={datasetDetails.description} />
        <DetailItem label="File Name" value={datasetDetails.file_name} />
        <DetailItem label="File Size" value={datasetDetails.file_size} />
        <DetailItem label="Errors" value={datasetDetails.errors} />
      </Grid>
    </Box>
  );
};

export default DatasetDetails;