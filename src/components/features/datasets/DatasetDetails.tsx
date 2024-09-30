import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner, useToast, SimpleGrid, Flex, Icon } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';
import { 
  IdentificationIcon, CheckCircleIcon, DocumentTextIcon, CalendarIcon, 
  ClockIcon, InformationCircleIcon, DocumentIcon, ArrowsUpDownIcon,
  ExclamationCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

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
      case 'uploaded': return 'green.500';
      case 'processing': return 'blue.500';
      case 'error': return 'red.500';
      default: return 'gray.500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        <DetailItem icon={DocumentTextIcon} label="Name" value={datasetDetails.name} />
        <DetailItem icon={IdentificationIcon} label="File-Id" value={datasetDetails.id} />
        <DetailItem icon={ClockIcon} label="Created At" value={new Date(datasetDetails.created_at).toLocaleString()} />
        <DetailItem icon={CheckCircleIcon} label="Status" value={datasetDetails.status} color={getStatusColor(datasetDetails.status)} />
        <DetailItem icon={InformationCircleIcon} label="Description" value={datasetDetails.description || 'No description'} />
        <DetailItem icon={DocumentIcon} label="File Name" value={datasetDetails.file_name} />
        <DetailItem icon={Bars3Icon} label="File Size" value={formatFileSize(datasetDetails.file_size)} />
        {datasetDetails.errors && (
          <DetailItem icon={ExclamationCircleIcon} label="Errors" value={datasetDetails.errors} color="red.500" />
        )}
      </SimpleGrid>
    </Box>
  );
};

export default DatasetDetails;