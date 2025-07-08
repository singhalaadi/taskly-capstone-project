import React from 'react';
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';

/**
 * Component to display a warning for demo users
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether the warning is visible
 * @param {function} props.onClose - Function to close the warning
 * @returns {JSX.Element} - Demo user warning component
 */
const DemoUserWarning = ({ isVisible = false, onClose }) => {
  if (!isVisible) return null;

  return (
    <Alert 
      status="warning" 
      variant="solid" 
      borderRadius="md" 
      mb={4}
    >
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription display="block">
          <Text>
            You're using a demo account. Some actions are restricted:
          </Text>
          <Text fontSize="sm" mt={1}>
            • You can view, create, and edit tasks
          </Text>
          <Text fontSize="sm">
            • You cannot delete tasks (demo data preservation)
          </Text>
        </AlertDescription>
      </Box>
      <CloseButton 
        position="absolute" 
        right="8px" 
        top="8px" 
        onClick={onClose} 
      />
    </Alert>
  );
};

export default DemoUserWarning;
