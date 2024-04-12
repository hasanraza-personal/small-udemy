import { Box, Flex, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setLoginStatus("Out")
    navigate('/')
  }

  useEffect(() => {
    if (localStorage.removeItem('user')) {
      setLoginStatus("In")
    } else {
      setLoginStatus("Out")
    }
  }, [loginStatus])

  return (
    <>
      <Flex boxShadow='xs' h='50px' alignItems='center' p={4} justifyContent='space-between'>
        <Box fontSize={30} ml={1.5}>Coventry University</Box>
        {/* {loginStatus === "In" && <> */}
        <Flex gap={4} alignItems="center">
          <Button colorScheme='red' variant='outline' onClick={handleLogout} size='sm'>
            Logout
          </Button>
        </Flex>
        {/* </>} */}
      </Flex>
    </>
  )
}

export default Header
