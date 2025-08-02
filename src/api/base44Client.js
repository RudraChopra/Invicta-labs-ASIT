import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "688d56675f00a7919c684216", 
  requiresAuth: true // Ensure authentication is required for all operations
});
