import { ObjectId } from 'mongodb';
import { dbConnect } from '../libs/dbConnect.js';

export const populateUser = async (req, res, next) => {
  // Skip if no user ID in session
  if (!req.session?.userId) {
    return next();
  }

  try {
    const db = await dbConnect();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(req.session.userId) 
    });
    
    if (user) {
      // Remove sensitive data
      const { password, ...userData } = user;
      
      // Add user data to request object
      req.user = userData;
    }
    
    next();
  } catch (error) {
    console.error("Error populating user data:", error);
    next();
  }
};
