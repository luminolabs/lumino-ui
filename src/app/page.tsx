'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VStack, Heading, Text, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isLoggedIn, isLoading, checkLoginStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      if (!isLoading) {
        const loggedIn = await checkLoginStatus();
        if (loggedIn) {
          router.push('/fine-tuning');
        } else {
          // Redirect to Auth0 login
          const response = await fetch('/api/settings');
          const settings = await response.json();
          window.location.href = `${settings.API_BASE_URL}v1/auth0/login`;
        }
      }
    };

    handleAuth();
  }, [isLoading, checkLoginStatus, router]);

  if (isLoading) {
    return (
      <Center height="calc(100vh - 64px)">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} align="center" justify="center" minHeight="calc(100vh - 64px - 56px)">
      <Heading color="purple.700" as="h1" size="xl" fontWeight="bold">
        Welcome to Lumino Dashboard
      </Heading>
      <Text fontSize="lg" color="gray.600">
        {isLoggedIn ? 'Redirecting to dashboard...' : 'Please log in to access the dashboard.'}
      </Text>
    </VStack>
  );
}