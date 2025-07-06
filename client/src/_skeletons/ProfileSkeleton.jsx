import {
  Box,
  Container,
  VStack,
  Stack,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ProfileSkeleton() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: "4", md: "8" }}>
      <Container
        maxW={{ base: "full", sm: "md", lg: "lg" }}
        px={{ base: "4", sm: "6" }}
      >
        <VStack spacing={{ base: "6", md: "8" }}>
          {/* Header Skeleton */}
          <VStack spacing={{ base: "3", md: "4" }} textAlign="center" w="full">
            <Skeleton height={{ base: "32px", md: "40px" }} width="60%" />
            <Skeleton height="16px" width="40%" />
          </VStack>

          {/* Profile Form Skeleton */}
          <Box
            bg={cardBg}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow={{ base: "md", md: "lg" }}
            p={{ base: "6", md: "8" }}
            w="full"
            maxW={{ base: "full", sm: "md" }}
          >
            <VStack spacing={{ base: "5", md: "6" }}>
              {/* Form Title */}
              <Skeleton height="24px" width="150px" />

              <Stack spacing={{ base: "4", md: "4" }} w="full">
                {/* Avatar Skeleton */}
                <VStack spacing="3">
                  <SkeletonCircle size={{ base: "20", md: "24" }} />
                  <Skeleton height="16px" width="200px" />
                </VStack>

                {/* Username Field */}
                <VStack align="flex-start" spacing="2" w="full">
                  <Skeleton height="16px" width="80px" />
                  <Skeleton
                    height={{ base: "40px", md: "48px" }}
                    width="full"
                  />
                </VStack>

                {/* Email Field */}
                <VStack align="flex-start" spacing="2" w="full">
                  <Skeleton height="16px" width="60px" />
                  <Skeleton
                    height={{ base: "40px", md: "48px" }}
                    width="full"
                  />
                </VStack>

                {/* Password Field */}
                <VStack align="flex-start" spacing="2" w="full">
                  <Skeleton height="16px" width="120px" />
                  <Skeleton
                    height={{ base: "40px", md: "48px" }}
                    width="full"
                  />
                </VStack>

                {/* Update Button */}
                <Skeleton
                  height={{ base: "40px", md: "48px" }}
                  width="full"
                  mt="4"
                />
              </Stack>
            </VStack>
          </Box>

          {/* Action Buttons Skeleton */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: "3", md: "4" }}
            w="full"
            maxW={{ base: "full", sm: "md" }}
          >
            <Skeleton height={{ base: "40px", md: "48px" }} flex="1" />
            <Skeleton height={{ base: "40px", md: "48px" }} flex="1" />
            <Skeleton height={{ base: "40px", md: "48px" }} flex="1" />
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
}
