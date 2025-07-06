import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import UpdateTaskSkeleton from '../_skeletons/UpdateTaskSkeleton';
import { API_BASE_URL } from '../utils/api.js';
import { Box, Heading } from '@chakra-ui/react';

export default function UpdateTask() {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                    credentials: 'include',
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setTask(data.task || data);
                } else {
                    console.error('Failed to fetch task');
                }
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTask();
        }
    }, [id]);

    if (loading) {
        return <UpdateTaskSkeleton />;
    }

    if (!task) {
        return (
            <Box p="5" maxW="4xl" mx="auto" minH="100vh" textAlign="center">
                <Heading as="h1" size="lg" color="red.500" mt="10">
                    Task not found
                </Heading>
            </Box>
        );
    }

    return (
        <Box p="5" maxW="4xl" mx="auto" minH="100vh">
            <Heading 
                as="h1" 
                fontSize="3xl" 
                fontWeight="semibold" 
                textAlign="center" 
                my="7"
            >
                Update Task
            </Heading>
            
            <TaskForm type="update" task={task} />
        </Box>
    );
}