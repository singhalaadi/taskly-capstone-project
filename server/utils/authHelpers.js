/**
 * Checks if a user is a demo user based on email pattern
 * @param {string} email - User email address
 * @returns {boolean} - True if demo user, false otherwise
 */
export const isDemoUser = (email) => {
  return email && (email.endsWith('@example.com') || email.includes('demo'));
};
