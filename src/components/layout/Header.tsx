import React from 'react';
import { Box, Flex, Spacer, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { CogIcon } from '@heroicons/react/24/outline';

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
    <Box as="header" bg="#F2F2F2" boxShadow="sm" py={4} px={8}>
      <Flex maxW="container.xl" alignItems="center">
        <NextLink href="/" passHref>
          <Flex as="a" marginLeft="2.5" alignItems="center">
            <Box position="absolute" width="128px" height="48px">
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
          <Link _hover={{ borderRadius: "10px",  bg: '#D6C6F6', color: '#4E00A6' }} as={NextLink} href="https://docs.luminolabs.ai" target="_blank" color="gray.600">
            Docs
          </Link>
          {isLoggedIn ? (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<CogIcon style={{ width: '24px', height: '24px' }} />}
                color="black"
                _hover={{ color: "#0005A6" }}
                aria-label="Settings"
              />
              <MenuList bg="white">
                <NextLink href="/settings" passHref>
                  <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} as="a">Settings</MenuItem>
                </NextLink>
                <NextLink href="https://www.luminolabs.ai/privacy-policy" target="_blank">
                  <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} as="a">Privacy Policy</MenuItem>
                </NextLink>
                <NextLink href="https://www.luminolabs.ai/terms-of-use" target="_blank">
                  <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} as="a">Terms of use</MenuItem>
                </NextLink>
                <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              icon={<CogIcon style={{ width: '24px', height: '24px' }} />}
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