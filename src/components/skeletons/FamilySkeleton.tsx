import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const FamilySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                  <Skeleton className="h-4 w-32 mx-auto mb-2" />
                  <Skeleton className="h-3 w-48 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-24 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};