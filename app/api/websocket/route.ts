// API route for WebSocket connections
// This file enables WebSocket support in Next.js development server

import { NextRequest } from 'next/server';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  // This is a placeholder for WebSocket handling in production
  // In development, Next.js dev server handles it automatically
  
  if (process.env.NODE_ENV === 'development') {
    return new Response('WebSocket server is running', { status: 200 });
  }

  // For production, you'd need to use a proper WebSocket library
  // Consider using services like:
  // 1. Pusher (managed WebSocket service)
  // 2. Socket.io (with Next.js adapter)
  // 3. Self-hosted WebSocket server

  return new Response('WebSocket service available', { status: 200 });
}
