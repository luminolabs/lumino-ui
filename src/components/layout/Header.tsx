import React from 'react';
import { Box, Flex, Spacer, Link, Button, useBreakpointValue, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred while logging out. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
          {isLoggedIn ? (
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
              onClick={() => window.location.reload()}
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