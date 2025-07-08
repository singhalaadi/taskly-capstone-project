import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Center,
  Input,
  Image,
  Tooltip,
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";

export function AvatarUploader({ imageUrl, onFieldChange, setFiles }) {
  const convertFileToUrl = (file) => URL.createObjectURL(file);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFiles(acceptedFiles);
        onFieldChange(convertFileToUrl(acceptedFiles[0]));
      }
    },
    [onFieldChange, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5 MB limit
  });

  return (
    <Center>
      <VStack spacing={2}>
        <Box
          {...getRootProps()}
          cursor="pointer"
          borderRadius="full"
          border={isDragActive ? "2px dashed blue" : "2px dashed transparent"}
          p={1}
          transition="all 0.2s"
          _hover={{
            borderColor: "blue.300",
            transform: "scale(1.05)",
          }}
        >
          <Input {...getInputProps()} />
          <Tooltip label="Click or drag to change your avatar">
            <Image
              alt="profile"
              rounded="full"
              h="24"
              w="24"
              objectFit="cover"
              cursor="pointer"
              src={
                imageUrl ||
                `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`
              }
              fallbackSrc={
                `${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/assets/default-user-avatar.png`
              }
              border="3px solid"
              borderColor="blue.200"
            />
          </Tooltip>
        </Box>
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Click to upload avatar
          <br />
          (JPG, PNG, WebP - Max 5MB)
        </Text>
      </VStack>
    </Center>
  );
}
