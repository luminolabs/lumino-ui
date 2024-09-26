import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
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