import { Link as ChakraLink, Container, Box, useToast, Stack, FormControl, FormLabel, Input, FormHelperText, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import "./login.css"

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (credentials.email.trim().length === 0) {
      toast({
        position: 'top',
        title: "Please provide an email",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    if (!isValidEmail(credentials.email)) {
      toast({
        position: 'top',
        title: "Please provide a valid email address",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }

    if (credentials.password.length < 6) {
      toast({
        position: 'top',
        title: "Password must contain atleast 6 characters",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return
    }
    setLoading(true)

    try {
      let response = await axios({
        method: 'POST',
        url: '/auth/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: credentials.email,
          password: credentials.password,
        }
      });

      localStorage.setItem('token', response.data.authToken);
      localStorage.setItem('user', response.data.data._id);
      localStorage.setItem('role', response.data.data.role);

      if (localStorage.getItem('role') === "admin") {
        navigate('/adminhome')
      } else {
        navigate('/studenthome')
      }

      toast({
        position: 'top',
        title: "Welcome",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.msg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Box className="login-container" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Container className="login-form">
          <Box className="login-title">Login page</Box>
          <Stack spacing='10px'>
            <FormControl className="form-control">
              <FormLabel>Userid</FormLabel>
              <Input type='email' name="email" onChange={onChange} placeholder='Enter your userid' />
            </FormControl>

            <FormControl className="form-control">
              <FormLabel>Password</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Enter password'
                  name="password"
                  onChange={onChange}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
          <Button className="login-button" colorScheme='blue' isLoading={loading} w="100%" onClick={handleSubmit}>Login</Button>
          <Box className="signup-link">
            <ChakraLink as={ReactRouterLink} to='/signup'>Don't have an account? Signup</ChakraLink>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Login
