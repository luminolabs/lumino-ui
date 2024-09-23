'use client'

import { ChakraProvider, Flex, Box, Spinner, Center } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import theme from "../theme";
import ErrorFallback from "@/components/ErrorFallback";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AuthProvider, useAuth } from '@/context/AuthContext';

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Header />
      <Flex flex={1}>
        <Sidebar />
        <Box as="main" flex={1} overflowX="hidden" overflowY="auto" bg="gray.50">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <ChakraProvider theme={theme}>
                <AppContent>{children}</AppContent>
              </ChakraProvider>
            </Suspense>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
