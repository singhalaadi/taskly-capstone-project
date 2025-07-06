import {
  Box,
  Skeleton,
  SkeletonText,
  Stack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

export default function SingleTaskSkeleton() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bg={bgColor} py="8">
      <Box p="5" maxW="4xl" mx="auto">
        {/* Back button skeleton */}
        <Skeleton height="40px" width="120px" mb="6" />

        {/* Main task card */}
        <Box bg={cardBg} p="8" borderRadius="lg" boxShadow="md">
          {/* Title skeleton */}
          <Skeleton height="40px" width="60%" mb="4" />

          {/* Priority and Status badges */}
          <Flex gap="3" mb="6">
            <Skeleton height="24px" width="80px" borderRadius="md" />
            <Skeleton height="24px" width="60px" borderRadius="md" />
          </Flex>

          {/* Description skeleton */}
          <Box mb="6">
            <Skeleton height="20px" width="30%" mb="3" />
            <SkeletonText mt="2" noOfLines={3} spacing="3" />
          </Box>

          {/* Dates section */}
          <Stack spacing="3" mb="6">
            <Flex justify="space-between">
              <Skeleton height="18px" width="80px" />
              <Skeleton height="18px" width="120px" />
            </Flex>
            <Flex justify="space-between">
              <Skeleton height="18px" width="90px" />
              <Skeleton height="18px" width="120px" />
            </Flex>
            <Flex justify="space-between">
              <Skeleton height="18px" width="100px" />
              <Skeleton height="18px" width="120px" />
            </Flex>
          </Stack>

          {/* Action buttons */}
          <Flex gap="4" justify="flex-end">
            <Skeleton height="40px" width="80px" />
            <Skeleton height="40px" width="100px" />
            <Skeleton height="40px" width="80px" />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
