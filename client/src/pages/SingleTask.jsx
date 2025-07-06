import { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api.js";
import { formatDateOnlyIST } from "../utils/dateHelpers";
import SingleTaskSkeleton from "../_skeletons/SingleTaskSkeleton.jsx";
import { BsChevronLeft } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import DeleteConfirmation from "../components/DeleteConfirmation";
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
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const taskData = data.task || data;
          setTask(taskData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDeleteTask = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        navigate("/tasks");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete task");
    }
  };

  if (!task) {
    return <SingleTaskSkeleton />;
  }

  return (
    <Box p="3" maxW="lg" mx="auto">
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
        <Button colorScheme="red" onClick={onOpen}>
          Delete Task
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
