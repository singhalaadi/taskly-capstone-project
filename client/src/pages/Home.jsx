import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  SimpleGrid,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaCheckCircle, FaUsers, FaClock, FaTasks } from "react-icons/fa";

export default function Home() {
  const { user } = useUser();

  return (
    <Box>
      {/* Simple Hero Section */}
      <Box bg="blue.500" color="white" py="20">
        <Container maxW="6xl">
          <VStack spacing="8" textAlign="center">
            <Heading size="2xl">Welcome to Taskzy!</Heading>
            <Text fontSize="xl" maxW="600px">
              A simple task management application built with the MERN stack.
              Organize your tasks, track your progress, and stay productive.
            </Text>

            {user ? (
              <VStack spacing="4">
                <Text fontSize="lg">Welcome back, {user.username}! 👋</Text>
                <Button
                  as={RouterLink}
                  to="/profile"
                  size="lg"
                  colorScheme="yellow"
                  color="gray.800"
                >
                  Go to Profile
                </Button>
              </VStack>
            ) : (
              <HStack spacing="4">
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  colorScheme="yellow"
                  color="gray.800"
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Sign In
                </Button>
              </HStack>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py="16" bg="gray.50">
        <Container maxW="6xl">
          <VStack spacing="12">
            <VStack spacing="4" textAlign="center">
              <Heading size="xl" color="gray.800">
                Project Features
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Built with React, Node.js, Express, and MongoDB
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="8">
              <FeatureCard
                icon={FaTasks}
                title="Task Management"
                description="Create, edit, and delete tasks easily"
              />
              <FeatureCard
                icon={FaCheckCircle}
                title="Mark Complete"
                description="Track your progress by marking tasks as done"
              />
              <FeatureCard
                icon={FaUsers}
                title="User Authentication"
                description="Secure login and registration system"
              />
              <FeatureCard
                icon={FaClock}
                title="Real-time Updates"
                description="See your changes instantly across the app"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Tech Stack Section */}
      <Box py="16" bg="white">
        <Container maxW="4xl" textAlign="center">
          <VStack spacing="8">
            <Heading size="xl" color="gray.800">
              Built With Modern Technologies
            </Heading>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="8">
              <TechItem title="React" description="Frontend Framework" />
              <TechItem title="Node.js" description="Backend Runtime" />
              <TechItem title="Express" description="Web Framework" />
              <TechItem title="MongoDB" description="Database" />
            </SimpleGrid>

            <Box mt="8">
              <Text color="gray.600" fontSize="lg">
                This is a capstone project demonstrating full-stack web
                development skills
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Simple CTA */}
      {!user && (
        <Box py="16" bg="blue.500" color="white">
          <Container maxW="4xl" textAlign="center">
            <VStack spacing="6">
              <Heading size="lg">Ready to try Taskzy?</Heading>
              <Text fontSize="lg">
                Sign up now and start organizing your tasks
              </Text>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="yellow"
                color="gray.800"
              >
                Create Account
              </Button>
            </VStack>
          </Container>
        </Box>
      )}
    </Box>
  );
}

// Simple Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <VStack
      p="6"
      bg="white"
      borderRadius="lg"
      shadow="md"
      spacing="4"
      textAlign="center"
      _hover={{ shadow: "lg" }}
      transition="all 0.2s"
    >
      <Icon as={icon} boxSize="8" color="blue.500" />
      <Heading size="md" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.600" fontSize="sm">
        {description}
      </Text>
    </VStack>
  );
}

// Tech Stack Item Component
function TechItem({ title, description }) {
  return (
    <VStack spacing="2">
      <Text fontSize="xl" fontWeight="bold" color="gray.800">
        {title}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {description}
      </Text>
    </VStack>
  );
}
