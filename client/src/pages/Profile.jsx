import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useUser } from "../context/UserContext.js";
import { API_BASE_URL } from "../util.js";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";
import { AvatarUploader } from "../components/AvatarUploader.jsx";
import {
  Box,
  Heading,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Button,
  Text,
  FormErrorMessage,
  VStack,
  HStack,
  Container,
  useColorModeValue,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [files, setFiles] = useState([]);

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const {
    control,
    register,
    handleSubmit,
    resetField,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      avatar:
        user?.avatar || "http://localhost:3000/assets/default-user-avatar.png",
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const password = watch("password");

  // Check if user is newly registered
  const isNewUser =
    user?.createdAt && new Date() - new Date(user.createdAt) < 5 * 60 * 1000; // 5 minutes

  // Function to upload file to Cloudinary
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    formData.append("image", files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/image/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const response = await res.json();

      if (res.ok) {
        return response.imageUrl;
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.log(error);
      throw error; 
    }
  };

  const doSubmit = async (values) => {
    let toastId;
    try {
      // Handle file upload if new files are selected
      if (files.length > 0) {
        toastId = toast.loading("Uploading image...");
        const newUrl = await handleFileUpload(files);
        if (newUrl) {
          values.avatar = newUrl;
          toast.success("Image uploaded successfully!", { id: toastId });
        }
      }

      // Start profile update
      if (!toastId) {
        toastId = toast.loading("Updating profile...");
      } else {
        toast.loading("Updating profile...", { id: toastId });
      }

      // Remove empty password fields
      const submitData = { ...values };
      if (!submitData.password) {
        delete submitData.password;
      }
      if (!submitData.confirmPassword) {
        delete submitData.confirmPassword;
      }

      const res = await fetch(`${API_BASE_URL}/users/update/${user._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.status === 200) {
        resetField("password");
        resetField("confirmPassword");
        setFiles([]); // Clear files after successful update
        updateUser({ ...user, ...submitData });
        toast.success("Profile Updated Successfully! 🎉", { id: toastId });
      } else {
        toast.error(data.error || data.message || "Profile update failed", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile Update Error: " + error.message, { id: toastId });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/delete/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || "Account deleted successfully");
        updateUser(null);
        navigate("/");
        onClose();
      } else {
        toast.error(data.error || data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Logged out successfully");
        updateUser(null);
        navigate("/");
      } else {
        toast.error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout Error: " + error.message);
    }
  };

  // If no user, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor} py="8">
      <Container maxW="lg">
        <VStack spacing="8">
          {/* Header */}
          <VStack spacing="4">
            <Heading size="xl" textAlign="center">
              {isNewUser
                ? `Welcome to Taskly, ${user.username}! 🎉`
                : `Welcome back, ${user.username}! 👋`}
            </Heading>
            <Text color={textColor} textAlign="center">
              {isNewUser
                ? "Complete your profile to get started"
                : "Manage your profile and account settings"}
            </Text>
          </VStack>

          {/* Profile Form */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            p="8"
            w="full"
            maxW="md"
          >
            <VStack spacing="6">
              <Heading size="md" textAlign="center">
                Update Profile
              </Heading>

              <form onSubmit={handleSubmit(doSubmit)} style={{ width: "100%" }}>
                <Stack spacing="4">
                  {/* Avatar Upload */}
                  <Controller
                    name="avatar"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <AvatarUploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFiles={setFiles}
                      />
                    )}
                  />

                  {/* Username */}
                  <FormControl isInvalid={errors.username}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Username
                    </FormLabel>
                    <Input
                      placeholder="Enter your username"
                      size="lg"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.username && errors.username.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Email */}
                  <FormControl isInvalid={errors.email}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      size="lg"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* New Password */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      New Password{" "}
                      <Text as="span" color="gray.500" fontSize="xs">
                        (leave blank to keep current)
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        size="lg"
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <InputRightElement h="12">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Confirm Password - Only show if password is entered */}
                  {password && (
                    <FormControl isInvalid={errors.confirmPassword}>
                      <FormLabel fontSize="sm" fontWeight="medium">
                        Confirm New Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          size="lg"
                          {...register("confirmPassword", {
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                        />
                        <InputRightElement h="12">
                          <IconButton
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            icon={
                              <Icon
                                as={showConfirmPassword ? FaEyeSlash : FaEye}
                              />
                            }
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            variant="ghost"
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.confirmPassword &&
                          errors.confirmPassword.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}

                  {/* Update Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Updating..."
                    w="full"
                    mt="4"
                  >
                    Update Profile
                  </Button>
                </Stack>
              </form>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing="4"
            w="full"
            maxW="md"
          >
            <Button
              as={RouterLink}
              to="/tasks"
              colorScheme="green"
              variant="solid"
              size="lg"
              flex="1"
            >
              View Tasks
            </Button>
            <Button
              onClick={handleLogout}
              colorScheme="gray"
              variant="solid"
              size="lg"
              flex="1"
            >
              Logout
            </Button>
            <Button
              onClick={onOpen}
              colorScheme="red"
              variant="outline"
              size="lg"
              flex="1"
            >
              Delete Account
            </Button>
          </Stack>
        </VStack>
      </Container>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        alertTitle="Delete Account"
        handleClick={handleDeleteUser}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}
