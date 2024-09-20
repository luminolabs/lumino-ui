import React from 'react';
import { Box, Flex, Spacer, Link, Button, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogin = () => {
    window.location.href = `${process.env.API_BASE_URL}auth0/login`;
  };
  const handleLogout = () => {
    window.location.href = `${process.env.API_BASE_URL}auth0/logout`;
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
              onClick={handleLogin}
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