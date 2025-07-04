export const errorHandler = (err, req, res, next) => {
    const defaultMessage = "We're having technical issues. Please try again later";
    
    // Log the error for debugging
    console.error('Error caught by middleware:', err);
    
    // Set default status and message
    let status = err.status || err.statusCode || 500;
    let message = err.message || defaultMessage;
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
    }
    
    // Handle MongoDB ObjectId errors
    if (err.message && err.message.includes('ObjectId')) {
        status = 400;
        message = 'Invalid ID format';
    }
    
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        status = 400;
        message = 'Duplicate entry found';
    }
    
    // Send error response
    res.status(status).json({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            details: err 
        })
    });
};

// Async error wrapper to catch async errors
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};