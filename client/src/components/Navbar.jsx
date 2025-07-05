import { Link as RouterLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext.js";
import { API_BASE_URL } from "../util.js";
import {
  Flex,
  Box,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";

export default function Navbar() {
    const { user, updateUser } = useUser();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            if (res.ok) {
                const data = await res.json();
                toast.success(data.message || 'Logged out successfully');
                updateUser(null);
                navigate('/');
            } else {
                toast.error('Logout failed');
            }
        } catch (error) {
            toast.error('Network error during logout');
            console.error('Logout error:', error);
        }
    };

    return (
        <Box as="nav" bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
            <Flex
                maxW="7xl"
                mx="auto"
                px="6"
                py="4"
                alignItems="center"
            >
                {/* Logo/Brand */}
                <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        📝 Taskly
                    </Text>
                </Link>

                <Spacer />

                {/* Navigation Links */}
                <HStack spacing="6">
                    {user ? (
                        <>
                            {/* Welcome Text */}
                            <Text fontSize="sm" color="gray.600" display={{ base: 'none', md: 'block' }}>
                                Welcome, {user.username}
                            </Text>
                            
                            {/* User Menu */}
                            <Menu>
                                <MenuButton>
                                    <Avatar
                                        size="sm"
                                        src={user.avatar}
                                        name={user.username}
                                        bg="blue.500"
                                        cursor="pointer"
                                        _hover={{ shadow: 'md' }}
                                    />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem as={RouterLink} to="/profile">
                                        👤 Profile
                                    </MenuItem>
                                    <MenuItem as={RouterLink} to="/tasks">
                                        📋 My Tasks
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} color="red.500">
                                        🚪 Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link 
                                as={RouterLink} 
                                to="/login" 
                                color="gray.600"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                Login
                            </Link>
                            <Button 
                                as={RouterLink} 
                                to="/register" 
                                colorScheme="blue" 
                                size="sm"
                                px="4"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
}

