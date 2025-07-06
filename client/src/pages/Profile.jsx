import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext.js";
import { API_BASE_URL } from "../utils/api.js";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";
import { AvatarUploader } from "../components/AvatarUploader.jsx";
import ProfileSkeleton from "../_skeletons/ProfileSkeleton.jsx";
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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (loading && user) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  // Check if user is newly registered
  const isNewUser =
    user?.createdAt && new Date() - new Date(user.createdAt) < 5 * 60 * 1000;

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
      if (files.length > 0) {
        toastId = toast.loading("Uploading image...");
        const newUrl = await handleFileUpload(files);
        if (newUrl) {
          values.avatar = newUrl;
          toast.success("Image uploaded successfully!", { id: toastId });
        }
      }

      if (!toastId) {
        toastId = toast.loading("Updating profile...");
      } else {
        toast.loading("Updating profile...", { id: toastId });
      }

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
        setFiles([]);
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

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: "4", md: "8" }}>
      <Container
        maxW={{ base: "full", sm: "md", lg: "lg" }}
        px={{ base: "4", sm: "6" }}
      >
        <VStack spacing={{ base: "6", md: "8" }}>
          {/* Header */}
          <VStack spacing={{ base: "3", md: "4" }} textAlign="center">
            <Heading
              size={{ base: "lg", md: "xl" }}
              px={{ base: "4", md: "0" }}
              lineHeight="shorter"
            >
              {isNewUser
                ? `Welcome to Taskzy, ${user.username}! 🎉`
                : `Welcome back, ${user.username}! 👋`}
            </Heading>
            <Text
              color={textColor}
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: "4", md: "0" }}
            >
              {isNewUser
                ? "Complete your profile to get started"
                : "Manage your profile and account settings"}
            </Text>
          </VStack>

          {/* Profile Form */}
          <Box
            bg={cardBg}
            borderRadius={{ base: "lg", md: "xl" }}
            boxShadow={{ base: "md", md: "lg" }}
            p={{ base: "6", md: "8" }}
            w="full"
            maxW={{ base: "full", sm: "md" }}
            mx="auto"
          >
            <VStack spacing={{ base: "5", md: "6" }}>
              <Heading size={{ base: "sm", md: "md" }} textAlign="center">
                Update Profile
              </Heading>

              <form onSubmit={handleSubmit(doSubmit)} style={{ width: "100%" }}>
                <Stack spacing={{ base: "4", md: "4" }}>
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
                    <FormLabel
                      fontSize={{ base: "sm", md: "sm" }}
                      fontWeight="medium"
                    >
                      Username
                    </FormLabel>
                    <Input
                      placeholder="Enter your username"
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "md", md: "md" }}
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.username && errors.username.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Email */}
                  <FormControl isInvalid={errors.email}>
                    <FormLabel
                      fontSize={{ base: "sm", md: "sm" }}
                      fontWeight="medium"
                    >
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "md", md: "md" }}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* New Password */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel
                      fontSize={{ base: "sm", md: "sm" }}
                      fontWeight="medium"
                    >
                      New Password{" "}
                      <Text
                        as="span"
                        color="gray.500"
                        fontSize={{ base: "xs", md: "xs" }}
                        display={{ base: "block", sm: "inline" }}
                      >
                        (leave blank to keep current)
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        size={{ base: "md", md: "lg" }}
                        fontSize={{ base: "md", md: "md" }}
                        pr="12"
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <InputRightElement h={{ base: "10", md: "12" }}>
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
                    <FormErrorMessage fontSize="xs">
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Confirm Password */}
                  {password && (
                    <FormControl isInvalid={errors.confirmPassword}>
                      <FormLabel
                        fontSize={{ base: "sm", md: "sm" }}
                        fontWeight="medium"
                      >
                        Confirm New Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          size={{ base: "md", md: "lg" }}
                          fontSize={{ base: "md", md: "md" }}
                          pr="12"
                          {...register("confirmPassword", {
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                        />
                        <InputRightElement h={{ base: "10", md: "12" }}>
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
                      <FormErrorMessage fontSize="xs">
                        {errors.confirmPassword &&
                          errors.confirmPassword.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}

                  {/* Update Button */}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size={{ base: "md", md: "lg" }}
                    isLoading={isSubmitting}
                    loadingText="Updating..."
                    w="full"
                    mt={{ base: "4", md: "4" }}
                    fontSize={{ base: "md", md: "md" }}
                  >
                    Update Profile
                  </Button>
                </Stack>
              </form>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: "3", md: "4" }}
            w="full"
            maxW={{ base: "full", sm: "md" }}
            px={{ base: "0", sm: "0" }}
          >
            <Button
              as={RouterLink}
              to="/tasks"
              colorScheme="green"
              variant="solid"
              size={{ base: "md", md: "lg" }}
              flex="1"
              fontSize={{ base: "sm", md: "md" }}
              minH={{ base: "10", md: "12" }}
            >
              View Tasks
            </Button>
            <Button
              onClick={handleLogout}
              colorScheme="gray"
              variant="solid"
              size={{ base: "md", md: "lg" }}
              flex="1"
              fontSize={{ base: "sm", md: "md" }}
              minH={{ base: "10", md: "12" }}
            >
              Logout
            </Button>
            <Button
              onClick={onOpen}
              colorScheme="red"
              variant="outline"
              size={{ base: "md", md: "lg" }}
              flex="1"
              fontSize={{ base: "sm", md: "md" }}
              minH={{ base: "10", md: "12" }}
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
