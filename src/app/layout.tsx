"use client";

import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import theme from "../theme";
import ErrorFallback from "@/components/ErrorFallback";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AuthProvider } from '@/context/AuthContext';

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
                <Flex flexDirection="column" minHeight="100vh">
                  <Header />
                  <Flex flex={1}>
                    <Sidebar />
                    <Box as="main" flex={1} overflowX="hidden" overflowY="auto" bg="gray.50">
                      {children}
                    </Box>
                  </Flex>
                </Flex>
              </ChakraProvider>
            </Suspense>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
