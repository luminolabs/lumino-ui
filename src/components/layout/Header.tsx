import React, { useEffect } from 'react';
import { Box, Flex, Spacer, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { CogIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const toast = useToast();
  const pathname = usePathname();
  const router = useRouter();

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
          <Link _hover={{ color: '#4E00A6' }} color={pathname.split("/")[1] === "fine-tuning" ? "#4E00A6" : "gray.600"} as={NextLink} href="/fine-tuning">
            Dashboard
          </Link>
          <Link _hover={{ color: '#4E00A6' }} as={NextLink} href="https://docs.luminolabs.ai" target="_blank" color="gray.600">
            Docs
          </Link>
          {isLoggedIn ? (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<CogIcon style={{ width: '24px', height: '24px' }} />}
                color={pathname === "/settings" ? "#4E00A6" : "black"}
                bg="transparent"
                _hover={{ color: "#4E00A6", bg: "#F3E8FF" }}
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
                  <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} as="a">Terms of Use</MenuItem>
                </NextLink>
                <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              icon={<CogIcon style={{ width: '24px', height: '24px' }} />}
              color={pathname === "/settings" ? "#4E00A6" : "gray.600"}
              bg="transparent"
              _hover={{ color: "#4E00A6", bg: "#F3E8FF" }}
              onClick={() => router.push('/settings')}
              aria-label="Settings"
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;