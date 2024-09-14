import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Spacer, Link as ChakraLink } from '@chakra-ui/react';
import logo from '../../public/logo.svg';

const Header = () => {
  return (
    <Box as="header" bg="white" boxShadow="md" py={6}>
      <Flex maxW="container.xl" mx="auto" alignItems="center">
        <Link href="/" passHref>
          <Image
            src={logo}
            alt="Lumino Logo"
            width={160}
            height={50}
            priority
          />
        </Link>
        <Spacer />
        <Flex as="nav" gap={8}>
          <ChakraLink as={Link} href="/dashboard" color="gray.600" _hover={{ color: 'purple.600' }} fontSize="lg">
            Dashboard
          </ChakraLink>
          <ChakraLink as={Link} href="/docs" color="gray.600" _hover={{ color: 'purple.600' }} fontSize="lg">
            Docs
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;