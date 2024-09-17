import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/layout/Sidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex>
      <Sidebar />
      <Box flex={1} p={8}>
        {children}
      </Box>
    </Flex>
  );
}