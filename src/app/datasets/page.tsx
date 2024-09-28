'use client'

import React, { useState } from 'react';
import { Box, Flex, Heading, Button, Text, Spinner, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import UploadDatasetModal from '@/components/features/datasets/UploadDatasetModal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const DatasetList = dynamic(() => import('@/components/features/datasets/DatasetList'), {
  loading: () => <Spinner />,
  ssr: false
});

const DatasetDetails = dynamic(() => import('@/components/features/datasets/DatasetDetails'), {
  loading: () => <Spinner />,
  ssr: false
});

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box width="24px" height="24px">
    {children}
  </Box>
);

export default function DatasetsPage() {
  const params = useParams();
  const datasetName = params?.datasetName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [firstDataset, setFirstDataset] = useState<string | null>(null);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Dataset uploaded successfully. Refreshing list...');
  };

  const handleFirstDatasetLoad = (datasetName: string | null) => {
    setFirstDataset(datasetName);
  };

  return (
    <Box p={4} bg="#F2F2F2" minH="calc(100vh - 64px)">
      <Flex mb={6} direction={isMobile ? "column" : "row"} justify="space-between" align={isMobile ? "stretch" : "center"}>
        <Heading size="lg" color="#261641" mb={isMobile ? 4 : 0}>Datasets</Heading>
        <Button 
          leftIcon={<IconWrapper> <PlusCircleIcon /></IconWrapper>}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          width={isMobile ? "100%" : "auto"}
          onClick={onOpen}
        >
          Upload Dataset
        </Button>
      </Flex>
      <Flex direction={isMobile ? "column" : "row"} height="100%">
        <Box width={isMobile ? "100%" : "35%"} bg="white" borderRadius="md" boxShadow="sm" mb={isMobile ? 4 : 0} mr={isMobile ? 0 : 6}>
          <Suspense fallback={<Spinner />}>
            <DatasetList refreshTrigger={refreshTrigger} onFirstDatasetLoad={handleFirstDatasetLoad} />
          </Suspense>
        </Box>
        {(datasetName || firstDataset) && (
          <Box flex={1} bg="white" borderRadius="md" boxShadow="sm" p={6} width={isMobile ? "100%" : "35%"}>
            <Suspense fallback={<Spinner />}>
              <DatasetDetails datasetName={datasetName || firstDataset || ''} />
            </Suspense>
          </Box>
        )}
      </Flex>
      <UploadDatasetModal isOpen={isOpen} onClose={onClose} onUploadSuccess={handleUploadSuccess} />
    </Box>
  );
}
