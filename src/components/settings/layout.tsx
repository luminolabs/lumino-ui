import { Box, Flex } from '@chakra-ui/react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex>
      <Box flex={1} p={8}>
        {children}
      </Box>
    </Flex>
  );
}