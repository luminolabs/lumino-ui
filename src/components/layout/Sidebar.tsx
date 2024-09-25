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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname.startsWith(path);

  useEffect(() => {
    setIsSettingsOpen(pathname.startsWith('/settings'));
  }, [pathname]);

  const handleSettingsClick = () => {
    if (!isSettingsOpen) {
      router.push('/settings');
    }
    setIsSettingsOpen(!isSettingsOpen);
  };

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <Box width="24px" height="24px">
      {children}
    </Box>
  );

  return (
    <Box width="200px" bg="gray.100" height="auto" p={4} overflowY="auto">
      <VStack align="stretch" spacing={2}>
        <Link href="/fine-tuning" passHref>
          <Button 
            as="a" 
            leftIcon={<IconWrapper><CpuChipIcon /></IconWrapper>}
            justifyContent="flex-start" 
            bg={isActive('/fine-tuning') ? '#E7E0FD' : 'transparent'}
            color={isActive('/fine-tuning') ? '#6B46C1' : 'gray.600'}
            _hover={{ bg: '#E7E0FD', color: '#6B46C1' }}
            w="100%"
          >
            Fine-tuning
          </Button>
        </Link>
        <Link href="/datasets" passHref>
          <Button 
            as="a" 
            leftIcon={<IconWrapper><ServerIcon /></IconWrapper>}
            justifyContent="flex-start" 
            bg={isActive('/datasets') ? '#E7E0FD' : 'transparent'}
            color={isActive('/datasets') ? '#6B46C1' : 'gray.600'}
            _hover={{ bg: '#E7E0FD', color: '#6B46C1' }}
            w="100%"
          >
            Datasets
          </Button>
        </Link>
        <Link href="/usage" passHref>
          <Button 
            as="a" 
            leftIcon={<IconWrapper><ChartBarIcon /></IconWrapper>}
            justifyContent="flex-start" 
            bg={isActive('/usage') ? '#E7E0FD' : 'transparent'}
            color={isActive('/usage') ? '#6B46C1' : 'gray.600'}
            _hover={{ bg: '#E7E0FD', color: '#6B46C1' }}
            w="100%"
          >
            Usage
          </Button>
        </Link>
        <Button
          leftIcon={<IconWrapper><Cog6ToothIcon /></IconWrapper>}
          rightIcon={isSettingsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          justifyContent="space-between"
          bg={isActive('/settings') ? '#E7E0FD' : 'transparent'}
          color={isActive('/settings') ? '#6B46C1' : 'gray.600'}
          _hover={{ bg: '#E7E0FD', color: '#6B46C1' }}
          onClick={handleSettingsClick}
          w="100%"
        >
          Settings
        </Button>
        <Collapse in={isSettingsOpen}>
          <VStack align="stretch" pl={6} mt={2} spacing={2}>
          <Link href="/settings" passHref>
            </Link>
            {/* <Link href="/settings/team" passHref>
              <Button as="a" variant="ghost" justifyContent="flex-start" size="sm"
                bg={isActive('/settings/team') ? '#E7E0FD' : 'transparent'}
                color={isActive('/settings/team') ? '#6B46C1' : 'gray.600'}
                _hover={{ bg: '#E7E0FD', color: '#6B46C1' }}
                w="100%"
              >
                Team
              </Button>
            </Link> */}
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
};

export default Sidebar;