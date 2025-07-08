import { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { API_BASE_URL, apiRequest } from "../utils/api.js";
import { formatDateOnlyIST } from "../utils/dateHelpers";
import SingleTaskSkeleton from "../_skeletons/SingleTaskSkeleton.jsx";
import { BsChevronLeft } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import DeleteConfirmation from "../components/DeleteConfirmation";
import DemoUserWarning from "../components/DemoUserWarning";
import { useUser } from "../context/UserContext.js";
import toast from "react-hot-toast";
import {
  Box,
  Link,
  Heading,
  Stack,
  Badge,
  Text,
  Card,
  CardBody,
  Button,
  Flex,
} from "@chakra-ui/react";

export default function SingleTask() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [task, setTask] = useState();
  const [loading, setLoading] = useState(true);
  const [showDemoWarning, setShowDemoWarning] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // Check if user is a demo user
  const isDemoUser =
    user?.email?.endsWith("@example.com") || user?.email?.includes("demo");

  // Determine if this is an original demo task or user-created task
  const isOriginalDemoTask = task?.isOriginalDemo;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const result = await apiRequest(`/tasks/${id}`);

        if (result.ok) {
          const taskData = result.data.task || result.data;
          setTask(taskData);
        } else {
          toast.error("Failed to load task");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error loading task");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDeleteTask = async () => {
    try {
      const result = await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
      });

      if (result.ok) {
        toast.success(result.data.message || "Task deleted successfully");
        navigate("/tasks");
      } else {
        // Special handling for demo user restrictions
        if (result.data?.isDemoUser) {
          toast.error(
            "Demo users cannot delete tasks. This is a demo account restriction.",
            {
              duration: 5000,
              icon: "🔒",
            }
          );
          setShowDemoWarning(true);
          onClose();
        } else {
          toast.error(
            result.data?.message || result.error || "Failed to delete task"
          );
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete task");
    }
  };

  if (loading || !task) {
    return <SingleTaskSkeleton />;
  }

  return (
    <Box p="3" maxW="lg" mx="auto">
      {/* Demo user warning */}
      <DemoUserWarning
        isVisible={showDemoWarning}
        onClose={() => setShowDemoWarning(false)}
      />

      <Link
        as={RouterLink}
        to="/tasks"
        color="teal"
        _hover={{ textDecor: "none" }}
        display="flex"
        alignItems="center"
        gap="2"
        mb="4"
      >
        <BsChevronLeft /> All Tasks
      </Link>

      <Heading fontSize="3xl" fontWeight="semibold" textAlign="center" my="7">
        {task.title}
      </Heading>

      <Stack direction="row" spacing="3" mb="4">
        <Badge fontSize="md" colorScheme={task.completed ? "green" : "orange"}>
          {task.completed ? "Done" : "Open"}
        </Badge>
        {task.dueDate && <Text>{formatDateOnlyIST(task.dueDate)}</Text>}
      </Stack>

      <Card mt="4" border="1px solid" borderColor="gray.200">
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb="2">
            Description
          </Text>
          <Text color="gray.600">
            {task.description || "No description provided."}
          </Text>

          <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
            Priority
          </Text>
          <Badge
            colorScheme={
              task.priority === "high"
                ? "red"
                : task.priority === "medium"
                ? "yellow"
                : "green"
            }
            textTransform="capitalize"
          >
            {task.priority || "Medium"}
          </Badge>

          <Text fontSize="lg" fontWeight="semibold" mt="4" mb="2">
            Created
          </Text>
          <Text color="gray.600">{formatDateOnlyIST(task.createdAt)}</Text>
        </CardBody>
      </Card>

      <Flex mt="6" justifyContent="flex-end" gap="3">
        <Button
          as={RouterLink}
          to={`/tasks/update/${id}`}
          colorScheme="blue"
          variant="outline"
        >
          Edit Task
        </Button>
        <Button
          colorScheme="red"
          onClick={onOpen}
          isDisabled={isDemoUser && isOriginalDemoTask}
          title={
            isDemoUser && isOriginalDemoTask
              ? "Demo users cannot delete original demo tasks"
              : ""
          }
        >
          Delete Task
          {isDemoUser && isOriginalDemoTask && " (Demo Restriction)"}
        </Button>
      </Flex>

      <DeleteConfirmation
        isOpen={isOpen}
        onClose={onClose}
        handleClick={handleDeleteTask}
      />
    </Box>
  );
}
