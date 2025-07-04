import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'
import {
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Flex,
  Heading,
  Stack,
  FormErrorMessage,
} from "@chakra-ui/react";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Handle form submission
    console.log('Form data:', data);
    
    try {
    //Send data to your API
      const response = await fetch('http://localhost:3000/api/v1/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        console.log('User registered successfully!');
        toast.success('Registration successful!');
        //Redirect to login or dashboard
      } else {
        toast.error('Redgistration failed!');
        console.error('Registration failed');
      }
    } catch (error) {
        toast.error('Something went wrong!');
      console.error('Error:', error);
    }
  };

  return (
    <Box p="3" maxW="lg" mx="auto">
      <Heading
        as="h1"
        textAlign="center"
        fontSize="3xl"
        fontWeight="semibold"
        my="7"
      >
        Create an Account
      </Heading>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4">
          {/* Username Field */}
          <FormControl isInvalid={errors.username}>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          {/* Email Field */}
          <FormControl isInvalid={errors.email}>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {/* Password Field */}
          <FormControl isInvalid={errors.password}>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Creating Account..."
          >
            Create Account
          </Button>
        </Stack>
      </form>

      <Flex gap="2" mt="5" justifyContent="center">
        <Text>Have an account?</Text>
        <Link to="/login">
          <Text as="span" color="blue.400" _hover={{ textDecoration: 'underline' }}>
            Sign in
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}
