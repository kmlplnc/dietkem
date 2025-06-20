import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@dietkem/api-types';

export const trpc = createTRPCReact<AppRouter>();

// Function to find the API server port
const findApiPort = async (): Promise<number> => {
  const ports = [3001, 3002, 3003, 3004, 3005];
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/trpc`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok || response.status === 400) { // 400 is expected for tRPC without procedure
        return port;
      }
    } catch (error) {
      // Continue to next port
    }
  }
  
  // Default to 3001 if no port found
  return 3001;
};

// Create a function that returns a new tRPC client with the latest token
export const createTRPCClient = async () => {
  const client = trpc.createClient({
    links: [
      httpBatchLink({
        // Use the Vite proxy instead of direct connection
        url: '/trpc',
        fetch: async (url, options) => {
          const currentToken = localStorage.getItem('token');
          
          // Ensure we have the default headers
          const defaultHeaders = {
            'Content-Type': 'application/json',
          };
          
          // Add Authorization header if token exists
          const headers = {
            ...defaultHeaders,
            ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
          };
          
          try {
            const response = await fetch(url, {
              ...options,
              headers,
            });
            
            // Check if response is ok
            if (!response.ok) {
              console.error('tRPC fetch error:', response.status, response.statusText);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check if response has content
            const text = await response.text();
            if (!text) {
              console.error('tRPC empty response');
              throw new Error('Empty response from server');
            }
            
            // Try to parse JSON
            try {
              JSON.parse(text);
            } catch (parseError) {
              console.error('tRPC JSON parse error:', parseError);
              console.error('Response text:', text);
              throw new Error('Invalid JSON response from server');
            }
            
            // Return a new Response with the text content
            return new Response(text, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          } catch (error) {
            console.error('tRPC fetch error:', error);
            throw error;
          }
        },
      }),
    ],
  });
  
  return client;
}; 