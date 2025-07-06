import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../utils/api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
} from "@chakra-ui/react";

const DatePickerStyles = () => (
  <style>
    {`
        .react-datepicker-wrapper {
            width: 100%;
        }
        .react-datepicker__input-container input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            font-size: 16px;
        }
        `}
  </style>
);

export default function TaskForm({ type, task }) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues:
      type === "update"
        ? {
            ...task,
            due: task.dueDate ? new Date(task.dueDate) : null,
            name: task.title,
            priority: task.priority || "",
            status: task.completed ? "done" : "open",
          }
        : {
            name: "",
            description: "",
            priority: "",
            status: "open",
            due: null,
          },
  });

  const navigate = useNavigate();

  const doSubmit = async (values) => {
    try {
      const taskData = {
        title: values.name,
        description: values.description,
        priority: values.priority,
        dueDate: values.due,
        completed: values.status === "done",
      };

      if (type === "create") {
        const res = await fetch(`${API_BASE_URL}/tasks/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        const response = await res.json();

        if (res.ok) {
          toast.success(`New Task Created: ${values.name}`);
          navigate("/tasks");
          window.location.reload();
        } else {
          toast.error(response.error || response.message);
        }
      }

      if (type === "update") {
        const res = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        const response = await res.json();

        if (res.status === 200) {
          toast.success(`Task Updated: ${values.name}`);
          navigate(`/tasks/${task._id}`);
        } else {
          toast.error(response.error || response.message);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while saving the task");
    }
  };

  return (
    <form onSubmit={handleSubmit(doSubmit)}>
      <Stack direction={{ base: "column", md: "row" }} gap="4">
        {/* Left Column - Name and Description */}
        <Flex direction="column" flex="1" gap="4">
          <FormControl isInvalid={errors.name}>
            <Input
              id="name"
              type="text"
              placeholder="Task Name"
              {...register("name", { required: "Task Name is required" })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.description}>
            <Textarea
              id="description"
              placeholder="Description"
              rows={4}
              {...register("description")}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        {/* Right Column - Priority, Status, Due Date */}
        <Flex direction="column" flex="1" gap="4">
          <FormControl isInvalid={errors.priority}>
            <Select
              placeholder="Priority"
              {...register("priority", { required: "Priority is required" })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <FormErrorMessage>
              {errors.priority && errors.priority.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.status}>
            <Select
              placeholder="Status"
              {...register("status", { required: "Status is required" })}
            >
              <option value="open">Open</option>
              <option value="done">Done</option>
            </Select>
            <FormErrorMessage>
              {errors.status && errors.status.message}
            </FormErrorMessage>
          </FormControl>

          {/* Due Date with DatePicker */}
          <FormControl>
            <DatePickerStyles />
            <Controller
              control={control}
              name="due"
              render={({ field }) => (
                <Input
                  as={DatePicker}
                  id="due"
                  {...field}
                  selected={field.value}
                  showTimeSelect
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  placeholderText="Due Date (Optional)"
                />
              )}
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="teal"
            textTransform="uppercase"
            size="lg"
            mt="2"
          >
            {type === "create" ? "Create Task" : "Update Task"}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
