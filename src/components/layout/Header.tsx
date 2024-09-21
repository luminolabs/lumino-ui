import React, { useState, useEffect } from 'react';
import { Box, Flex, Spacer, Link, Button, useBreakpointValue, Spinner } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch API settings');
        }
        const settings = await response.json();
        setApiBaseUrl(settings.API_BASE_URL);
      } catch (error) {
        console.error('Failed to fetch API settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiSettings();
  }, []);

  const handleLogin = () => {
    if (apiBaseUrl) {
      window.location.href = `${apiBaseUrl}v1/auth0/login`;
    } else {
      console.error('API base URL is not available');
    }
  };

  const handleLogout = () => {
    if (apiBaseUrl) {
      window.location.href = `${apiBaseUrl}v1/auth0/logout`;
    } else {
      console.error('API base URL is not available');
    }
  };

  return (
    <Box as="header" bg="white" boxShadow="sm" py={4} px={8}>
      <Flex maxW="container.xl" mx="auto" alignItems="center">
        <NextLink href="/" passHref>
          <Flex as="a" alignItems="center">
            <Box position="absolute" width="128px" height="32px">
              <Image
                src="/logo.svg"
                alt="Lumino Logo"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Flex>
        </NextLink>
        <Spacer />
        <Flex gap={6} alignItems="center">
          <Link as={NextLink} href="https://docs.luminolabs.ai" target="_blank" color="gray.600">
            Docs
          </Link>
          {isLoading ? (
            <Spinner size="sm" color="#4e00a6" />
          ) : isLoggedIn ? (
            <Button
              color="white"
              bg="#4e00a6"
              _hover={{ bg: "#0005A6" }}
              width={isMobile ? "100%" : "auto"}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="white"
              bg="#4e00a6"
              _hover={{ bg: "#0005A6" }}
              width={isMobile ? "100%" : "auto"}
              onClick={handleLogin}
              isDisabled={!apiBaseUrl}
            >
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;