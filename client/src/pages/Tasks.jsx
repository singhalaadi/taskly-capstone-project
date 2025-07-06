import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext.js";
import { API_BASE_URL } from "../utils/api.js";
import { formatDateOnlyIST } from "../utils/dateHelpers";
import TasksSkeleton from "../_skeletons/TasksSkeleton.jsx";
import Pagination from "../components/pagination";
import { BsArrowUp, BsArrowDownUp } from "react-icons/bs";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Tasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination settings
  const pageSize = 10;
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // Add sorting function
  const handleOrderBy = (value) => {
    searchParams.set("orderBy", value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/tasks/user/${user._id}`, {
          credentials: "include",
        });

        if (res.ok) {
          const { tasks } = await res.json();
          setTasks(tasks);
          setFilteredTasks(tasks);
        } else {
          const error = await res.json();
          toast.error(error.error || "Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Error fetching tasks: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    if (!tasks) return;

    let filtered = tasks;

    if (statusFilter !== "") {
      filtered = filtered.filter((task) => {
        if (statusFilter === "open") return !task.completed;
        if (statusFilter === "done") return task.completed;
        return true;
      });
    }

    const orderBy = searchParams.get("orderBy");
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (orderBy) {
          case "name":
            return a.title.localeCompare(b.title);
          case "priority":
            return (
              (priorityOrder[b.priority] || 2) -
              (priorityOrder[a.priority] || 2)
            );
          case "status":
            return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
          case "due":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          default:
            return 0;
        }
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchParams]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  // Calculate paginated tasks
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = filteredTasks
    ? filteredTasks.slice(startIndex, endIndex)
    : [];
  const totalTasks = filteredTasks ? filteredTasks.length : 0;

  if (!tasks || loading) {
    return <TasksSkeleton />;
  }

  return (
    <Box minH="100vh" bg={bgColor} py="8">
      <Box p="5" maxW="6xl" mx="auto">
        <Heading
          as="h1"
          fontSize="3xl"
          fontWeight="semibold"
          textAlign="center"
          my="7"
        >
          Tasks to do
        </Heading>

        {/* Filter and Create Button */}
        <Flex justify="space-between" mb="6" gap="4" flexWrap="wrap">
          <Box w="200px">
            <Select
              placeholder="All Tasks"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              bg={cardBg}
            >
              <option value="open">Open</option>
              <option value="done">Done</option>
            </Select>
          </Box>
          <Button
            as={Link}
            to="/tasks/create"
            colorScheme="green"
            textTransform="uppercase"
            fontWeight="semibold"
            px="6"
          >
            Create New Task
          </Button>
        </Flex>

        {/* Tasks Count */}
        {totalTasks > 0 && (
          <Box mb="4">
            <Text fontSize="sm" color="gray.600" mb="2">
              Showing {startIndex + 1}-{Math.min(endIndex, totalTasks)} of{" "}
              {totalTasks} tasks
              {statusFilter && ` (filtered by: ${statusFilter})`}
              {searchParams.get("orderBy") &&
                ` (sorted by: ${searchParams.get("orderBy")})`}
            </Text>
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              💡 Click on column headers to sort your tasks
            </Text>
          </Box>
        )}

        {/* Tasks Table */}
        {totalTasks === 0 ? (
          <Box
            bg={cardBg}
            p="8"
            borderRadius="lg"
            textAlign="center"
            boxShadow="md"
          >
            <Text fontSize="lg" color="gray.500">
              {statusFilter === ""
                ? "No tasks found. Create your first task!"
                : `No ${statusFilter} tasks found.`}
            </Text>
            <Button as={Link} to="/tasks/create" colorScheme="blue" mt="4">
              Create Your First Task
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer bg={cardBg} borderRadius="lg" boxShadow="md">
              <Table px="3" border="2px solid" borderColor="gray.100">
                <Thead backgroundColor="gray.100">
                  <Tr>
                    <Th>
                      <Tooltip
                        label="Click to sort by task name"
                        placement="top"
                      >
                        <Flex
                          onClick={() => handleOrderBy("name")}
                          cursor="pointer"
                          align="center"
                          gap="1"
                          _hover={{
                            color: "blue.500",
                            bg: "blue.50",
                            transform: "translateY(-1px)",
                          }}
                          p="2"
                          borderRadius="md"
                          transition="all 0.2s"
                          userSelect="none"
                        >
                          Task
                          {searchParams.get("orderBy") === "name" ? (
                            <BsArrowUp color="blue" />
                          ) : (
                            <BsArrowDownUp opacity="0.4" size={12} />
                          )}
                        </Flex>
                      </Tooltip>
                    </Th>

                    <Th>
                      <Tooltip
                        label="Click to sort by priority"
                        placement="top"
                      >
                        <Flex
                          onClick={() => handleOrderBy("priority")}
                          cursor="pointer"
                          align="center"
                          gap="1"
                          _hover={{
                            color: "blue.500",
                            bg: "blue.50",
                            transform: "translateY(-1px)",
                          }}
                          p="2"
                          borderRadius="md"
                          transition="all 0.2s"
                          userSelect="none"
                        >
                          Priority
                          {searchParams.get("orderBy") === "priority" ? (
                            <BsArrowUp color="blue" />
                          ) : (
                            <BsArrowDownUp opacity="0.4" size={12} />
                          )}
                        </Flex>
                      </Tooltip>
                    </Th>

                    <Th>
                      <Tooltip label="Click to sort by status" placement="top">
                        <Flex
                          onClick={() => handleOrderBy("status")}
                          cursor="pointer"
                          align="center"
                          gap="1"
                          _hover={{
                            color: "blue.500",
                            bg: "blue.50",
                            transform: "translateY(-1px)",
                          }}
                          p="2"
                          borderRadius="md"
                          transition="all 0.2s"
                          userSelect="none"
                        >
                          Status
                          {searchParams.get("orderBy") === "status" ? (
                            <BsArrowUp color="blue" />
                          ) : (
                            <BsArrowDownUp opacity="0.4" size={12} />
                          )}
                        </Flex>
                      </Tooltip>
                    </Th>

                    <Th>
                      <Tooltip
                        label="Click to sort by due date"
                        placement="top"
                      >
                        <Flex
                          onClick={() => handleOrderBy("due")}
                          cursor="pointer"
                          align="center"
                          gap="1"
                          _hover={{
                            color: "blue.500",
                            bg: "blue.50",
                            transform: "translateY(-1px)",
                          }}
                          p="2"
                          borderRadius="md"
                          transition="all 0.2s"
                          userSelect="none"
                        >
                          Due Date
                          {searchParams.get("orderBy") === "due" ? (
                            <BsArrowUp color="blue" />
                          ) : (
                            <BsArrowDownUp opacity="0.4" size={12} />
                          )}
                        </Flex>
                      </Tooltip>
                    </Th>

                    <Th>Created</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedTasks.map((task) => (
                    <Tr key={task._id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Link to={`/tasks/${task._id}`}>
                          <Box>
                            <Text
                              fontWeight="semibold"
                              color="blue.500"
                              _hover={{ textDecoration: "underline" }}
                            >
                              {task.title}
                            </Text>
                            {task.description && (
                              <Text fontSize="sm" color="gray.500" mt="1">
                                {task.description.length > 50
                                  ? task.description.substring(0, 50) + "..."
                                  : task.description}
                              </Text>
                            )}
                          </Box>
                        </Link>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getPriorityColor(task.priority)}
                          textTransform="capitalize"
                        >
                          {task.priority || "medium"}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={task.completed ? "green" : "orange"}
                        >
                          {task.completed ? "Done" : "Open"}
                        </Badge>
                      </Td>
                      <Td>
                        {task.dueDate ? formatDateOnlyIST(task.dueDate) : "-"}
                      </Td>
                      <Td>{formatDateOnlyIST(task.createdAt)}</Td>
                      <Td>
                        <Flex gap="2">
                          <Button
                            as={Link}
                            to={`/tasks/update/${task._id}`}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            _hover={{ bg: "blue.50" }}
                            fontWeight="medium"
                          >
                            Edit
                          </Button>
                          <Button
                            as={Link}
                            to={`/tasks/${task._id}`}
                            size="sm"
                            colorScheme="gray"
                            variant="ghost"
                            _hover={{ bg: "gray.50" }}
                            fontWeight="medium"
                          >
                            View
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination Component */}
            <Pagination
              itemCount={totalTasks}
              pageSize={pageSize}
              currentPage={currentPage}
            />
          </>
        )}

        {/* Back to Profile Button */}
        <Flex justify="center" mt="8">
          <Button as={Link} to="/profile" variant="outline" colorScheme="gray">
            Back to Profile
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
