import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api.js";
import { useUser } from "../context/UserContext.js";
import {
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Heading,
  Stack,
  FormErrorMessage,
  Container,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(135deg, blue.400, purple.600)",
    "linear(135deg, blue.600, purple.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const onSubmit = async (data) => {
    console.log("Form data:", data);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User registered successfully!");
        toast.success("Welcome to Taskzy! 🎉");
        updateUser(result.user);
        navigate("/profile");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Registration failed!");
        console.error("Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    }
  };

  return (
    <Box
      h="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py="8"
    >
      <Container maxW="md">
        <Box
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="2xl"
          p="6"
          transform="scale(1)"
          _hover={{ transform: "scale(1.02)" }}
          transition="all 0.2s"
          maxH="90vh"
          overflowY="auto"
        >
          {/* Header*/}
          <VStack spacing="4" mb="6">
            {" "}
            {/*  */}
            <Box bg="blue.500" p="3" borderRadius="full" color="white">
              <Icon as={FaUserPlus} boxSize="6" />
            </Box>
            <VStack spacing="1">
              {" "}
              {/*  */}
              <Heading size="md" textAlign="center">
                {" "}
                {/*  */}
                Join Taskzy
              </Heading>
              <Text color={textColor} textAlign="center" fontSize="sm">
                {" "}
                {/* */}
                Create your account and start organizing
              </Text>
            </VStack>
          </VStack>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              {" "}
              {/* Username Field */}
              <FormControl isInvalid={errors.username}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    size="md"
                    borderRadius="lg"
                    focusBorderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                    transition="all 0.2s"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage fontSize="xs">
                  {" "}
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              {/* Email Field */}
              <FormControl isInvalid={errors.email}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaEnvelope} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    size="md"
                    borderRadius="lg"
                    focusBorderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                    transition="all 0.2s"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage fontSize="xs">
                  {" "}
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              {/* Password Field */}
              <FormControl isInvalid={errors.password}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    size="md" 
                    borderRadius="lg"
                    focusBorderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                    transition="all 0.2s"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage fontSize="xs">
                  {" "}
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                borderRadius="lg"
                isLoading={isSubmitting}
                loadingText="Creating Account..."
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
                leftIcon={<Icon as={FaUserPlus} />}
              >
                Create Account
              </Button>
            </Stack>
          </form>

          {/* Footer */}
          <Box mt="4" textAlign="center">
            {" "}
            <Text color={textColor} fontSize="sm">
              {" "}
              Already have an account?{" "}
              <Link as={Link} to="/login">
                <Text
                  as="span"
                  color="blue.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: "underline", color: "blue.600" }}
                  transition="all 0.2s"
                >
                  Sign in here
                </Text>
              </Link>
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
