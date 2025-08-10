/*
 * AIKEYS FINANCIAL PLATFORM - API UTILITIES
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import { handleFlagsRequest } from '../api/admin/flags';

/**
 * Simple API router for development server
 * In production, this would be handled by proper backend routing
 */
export async function handleApiRequest(url: string, request: Request): Promise<Response> {
  const pathname = new URL(url).pathname;

  if (pathname === '/api/admin/flags') {
    return handleFlagsRequest(request);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}