import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#F2F2F2',
        color: 'gray.900',
      },
    },
  },
  fonts: {
    heading: 'DM Sans, sans-serif',
    body: 'DM Sans, sans-serif',
  },
  colors: {
    brand: {
      100: "#E7E0FD",
      500: "#6B46C1",
    },
  },
  // Add any other theme customizations here
})

export default theme