import React, { useState, useEffect } from 'react';
import { Box, VStack, Button, Collapse, Text } from '@chakra-ui/react';
import {
  CpuChipIcon,
  ServerIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <Box width="24px" height="24px">
      {children}
    </Box>
  );

  return (
    <Box width="250px" bg="gray.100" height="auto" p={4} overflowY="auto">
      <VStack align="stretch" spacing={2} paddingLeft="inherit" paddingRight="inherit">
        <Link href="/fine-tuning" passHref>
          <Button
            style={{ alignContent: "center" }}
            as="a"
            leftIcon={<IconWrapper><CpuChipIcon /></IconWrapper>}
            justifyContent="flex-start"
            bg={isActive('/fine-tuning') ? '#D6C6F6' : 'transparent'}
            color={isActive('/fine-tuning') ? '#4E00A6' : '#261641'}
            _hover={{ bg: '#D6C6F6', color: '#4E00A6' }}
            w="100%"
          >
            <p style={{ margin: "3%" }}>
              Fine-tuning
            </p>
          </Button>
        </Link>
        <Link href="/datasets" passHref>
          <Button
            style={{ alignContent: "center" }}
            as="a"
            leftIcon={<IconWrapper><ServerIcon /></IconWrapper>}
            justifyContent="flex-start"
            bg={isActive('/datasets') ? '#D6C6F6' : 'transparent'}
            color={isActive('/datasets') ? '#4E00A6' : '#261641'}
            _hover={{ bg: '#D6C6F6', color: '#4E00A6' }}
            w="100%"
          >
            <p style={{ margin: "3%" }}>
              Datasets
            </p>
          </Button>
        </Link>
        <Link href="/usage" passHref>
          <Button
            style={{ alignContent: "center" }}
            as="a"
            leftIcon={<IconWrapper><ChartBarIcon /></IconWrapper>}
            justifyContent="flex-start"
            bg={isActive('/usage') ? '#D6C6F6' : 'transparent'}
            color={isActive('/usage') ? '#4E00A6' : '#261641'}
            _hover={{ bg: '#D6C6F6', color: '#4E00A6' }}
            w="100%"
          >
            <p style={{ margin: "3%" }}>
              Usage
            </p>
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;