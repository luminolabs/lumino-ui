import React from 'react';
import { Box, Flex, Spacer, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
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
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<Cog6ToothIcon style={{ width: '24px', height: '24px' }} />}
                color="black"
                _hover={{ color: "#0005A6" }}
                aria-label="Settings"
              />
              <MenuList bg="white">
                <NextLink href="/settings" passHref>
                  <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} as="a">Settings</MenuItem>
                </NextLink>
                <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              icon={<Cog6ToothIcon style={{ width: '24px', height: '24px' }} />}
              color="white"
              _hover={{ bg: '#D6C6F6', color: '#4E00A6' }}
              onClick={() => window.location.reload()}
              aria-label="Login"
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;