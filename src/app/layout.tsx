import { Flex, Box } from '@chakra-ui/react';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Lumino Dashboard',
  description: 'A dashboard for managing fine-tuning jobs and datasets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Flex height="100vh">
            <Sidebar />
            <Flex direction="column" flex={1}>
              <Header />
              <Box as="main" flex={1} overflowY="auto" bg="gray.50" p={8}>
                {children}
              </Box>
            </Flex>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}