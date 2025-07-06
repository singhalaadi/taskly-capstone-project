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
  Flex,
  Heading,
  Stack,
  FormErrorMessage,
  Container,
  VStack,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  Checkbox,
  IconButton,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaTasks,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(135deg, blue.400, purple.600)",
    "linear(135deg, blue.600, purple.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const doSubmit = async (values) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success("Welcome back! 👋");
        updateUser(data.user);
        navigate("/profile");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const fillDemoCredentials = () => {
    setValue("email", "john26@gmail.com");
    setValue("password", "john123");
    toast.success("Demo credentials filled!");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      h="95vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
    >
      <Container maxW="md" h="auto">
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
            <Box
              bg="blue.500"
              p="3"
              borderRadius="full"
              color="white"
            >
              <Icon as={FaTasks} boxSize="6" />
            </Box>
            <VStack spacing="1">
              {" "}
              <Heading size="md" textAlign="center">
                {" "}
                Welcome Back
              </Heading>
              <Text color={textColor} textAlign="center" fontSize="sm">
                {" "}
                Sign in to continue to Taskzy
              </Text>
            </VStack>
          </VStack>

          {/* Demo Credentials*/}
          <Box
            bg="blue.50"
            p="3"
            borderRadius="lg"
            mb="4" 
            border="1px"
            borderColor="blue.200"
            cursor="pointer"
            _hover={{ bg: "blue.100", borderColor: "blue.300" }}
            transition="all 0.2s"
            onClick={fillDemoCredentials}
          >
            <Text fontSize="xs" fontWeight="semibold" color="blue.800" mb="1">
              {" "}
              {/* Smaller text */}
              🚀 Demo Credentials (Click to fill):
            </Text>
            <Text fontSize="xs" color="blue.600">
              {" "}
              {/* Smaller text */}
              📧 Email: john26@gmail.com
            </Text>
            <Text fontSize="xs" color="blue.600">
              {" "}
              {/* Smaller text */}
              🔒 Password: john123
            </Text>
            <Text fontSize="10px" color="blue.500" mt="1" fontStyle="italic">
              {" "}
              {/* Smaller text */}
              Click this box to auto-fill the form
            </Text>
          </Box>

          {/* Form*/}
          <form onSubmit={handleSubmit(doSubmit)}>
            <Stack spacing="4">
              {" "}
              {/* Reduced spacing */}
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
                  {/* Smaller error text */}
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              {/* Password Field with Show/Hide */}
              <FormControl isInvalid={errors.password}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                      onClick={togglePasswordVisibility}
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: "blue.500" }}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs">
                  {" "}
                  {/* Smaller error text */}
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              {/* Remember Me & Forgot Password */}
              <Flex justify="space-between" align="center">
                <Checkbox colorScheme="blue" size="sm">
                  <Text fontSize="sm">Remember me</Text>
                </Checkbox>
                <Text
                  as="button"
                  type="button"
                  fontSize="sm"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                  transition="all 0.2s"
                >
                  Forgot password?
                </Text>
              </Flex>
              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                borderRadius="lg"
                isLoading={isSubmitting}
                loadingText="Signing In..."
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
                leftIcon={<Icon as={FaSignInAlt} />}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          {/* Footer*/}
          <Box mt="4" textAlign="center">
            {" "}
            <Text color={textColor} fontSize="sm">
              {" "}
              {/* Smaller text */}
              Don't have an account?{" "}
              <Link as={Link} to="/register">
                <Text
                  as="span"
                  color="blue.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: "underline", color: "blue.600" }}
                  transition="all 0.2s"
                >
                  Sign up here
                </Text>
              </Link>
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
