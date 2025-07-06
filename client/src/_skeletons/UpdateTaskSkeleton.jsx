import { Box, Stack, Skeleton, Flex } from "@chakra-ui/react";

export default function UpdateTaskSkeleton() {
  return (
    <Box p="5" maxW="4xl" mx="auto" minH="100vh">
      {/* Title Skeleton */}
      <Skeleton height="40px" width="300px" mx="auto" mb="7" />

      {/* Form Skeleton */}
      <Flex direction={{ base: "column", md: "row" }} gap="4">
        {/* Left Column */}
        <Box width={{ base: "100%", md: "50%" }}>
          <Stack gap="4">
            <Skeleton height="40px" /> {/* Task Name */}
            <Skeleton height="100px" /> {/* Description */}
          </Stack>
        </Box>

        {/* Right Column */}
        <Box width={{ base: "100%", md: "50%" }}>
          <Stack gap="4">
            <Skeleton height="40px" /> {/* Priority */}
            <Skeleton height="40px" /> {/* Status */}
            <Skeleton height="40px" /> {/* Due Date */}
            <Skeleton height="50px" /> {/* Submit Button */}
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
