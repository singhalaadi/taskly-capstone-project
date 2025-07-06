import {
  Skeleton,
  Stack,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export default function TasksSkeleton() {
  return (
    <Box minH="100vh" py="8">
      <Box p="5" maxW="6xl" mx="auto">
        {/* Title skeleton */}
        <Skeleton height="40px" width="200px" mx="auto" mb="8" />

        {/* Filter and button skeleton */}
        <Stack direction="row" justify="space-between" mb="6">
          <Skeleton height="40px" width="200px" />
          <Skeleton height="40px" width="150px" />
        </Stack>

        {/* Table skeleton */}
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Skeleton height="20px" />
                </Th>
                <Th>
                  <Skeleton height="20px" />
                </Th>
                <Th>
                  <Skeleton height="20px" />
                </Th>
                <Th>
                  <Skeleton height="20px" />
                </Th>
                <Th>
                  <Skeleton height="20px" />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {[1, 2, 3].map((i) => (
                <Tr key={i}>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
