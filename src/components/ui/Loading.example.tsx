import { useState } from 'react'
import { LoadingSpinner, LoadingDots, LoadingPulse, LoadingOverlay } from './Loading'
import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonList } from './Skeleton'
import Button from './Button'
import { Card, CardHeader, CardBody } from './Card'

export function LoadingExamples() {
  const [overlayLoading, setOverlayLoading] = useState(false)

  const simulateLoading = () => {
    setOverlayLoading(true)
    setTimeout(() => setOverlayLoading(false), 3000)
  }

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-xl font-semibold text-white">Loading Components</h2>

      {/* Loading Spinners */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Spinners</h3>
        <div className="flex items-center gap-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center space-y-2">
            <LoadingSpinner size="sm" />
            <p className="text-xs text-gray-400">Small</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="md" />
            <p className="text-xs text-gray-400">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-gray-400">Large</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="xl" />
            <p className="text-xs text-gray-400">Extra Large</p>
          </div>
        </div>
      </div>

      {/* Loading Dots */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Animated Dots</h3>
        <div className="flex items-center gap-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center space-y-2">
            <LoadingDots size="sm" />
            <p className="text-xs text-gray-400">Small</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingDots size="md" />
            <p className="text-xs text-gray-400">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingDots size="lg" />
            <p className="text-xs text-gray-400">Large</p>
          </div>
        </div>
      </div>

      {/* Loading Pulse */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Pulse Loader</h3>
        <div className="flex items-center gap-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center space-y-2">
            <LoadingPulse size="sm" />
            <p className="text-xs text-gray-400">Small</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingPulse size="md" />
            <p className="text-xs text-gray-400">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingPulse size="lg" />
            <p className="text-xs text-gray-400">Large</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Loading Overlay</h3>
        <div className="flex gap-4">
          <Button onClick={simulateLoading}>
            Simulate Loading
          </Button>
        </div>

        <LoadingOverlay loading={overlayLoading} className="min-h-[200px]">
          <Card>
            <CardHeader>
              <h4 className="text-white font-medium">Sample Content</h4>
            </CardHeader>
            <CardBody>
              <p className="text-gray-300">
                This content will be covered by a loading overlay when the loading state is active.
                The overlay includes a backdrop blur effect and a centered spinner.
              </p>
            </CardBody>
          </Card>
        </LoadingOverlay>
      </div>
    </div>
  )
}

export function SkeletonExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-xl font-semibold text-white">Skeleton Components</h2>

      {/* Basic Skeleton */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Basic Skeleton</h3>
        <div className="space-y-3 max-w-md">
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} />
          <Skeleton height={16} width="80%" />
          <div className="flex gap-2">
            <Skeleton width={80} height={32} />
            <Skeleton width={60} height={32} />
          </div>
        </div>
      </div>

      {/* Skeleton Text */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Skeleton Text</h3>
        <div className="max-w-lg">
          <SkeletonText lines={4} />
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Skeleton Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <SkeletonCard />
          <SkeletonCard showImage={false} showAvatar={true} />
        </div>
      </div>

      {/* Skeleton Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Skeleton Table</h3>
        <SkeletonTable rows={6} columns={5} className="max-w-4xl" />
      </div>

      {/* Skeleton List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Skeleton List</h3>
        <div className="max-w-2xl">
          <SkeletonList items={4} />
        </div>
      </div>
    </div>
  )
}

// Ejemplos específicos del admin panel
export function AdminLoadingStates() {
  const [postsLoading, setPostsLoading] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-xl font-semibold text-white">Admin Panel Loading States</h2>

      {/* Dashboard loading */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Dashboard Loading</h3>
          <Button
            size="sm"
            onClick={() => {
              setDashboardLoading(true)
              setTimeout(() => setDashboardLoading(false), 2000)
            }}
          >
            Simulate Loading
          </Button>
        </div>

        {dashboardLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stats cards */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800/50 p-4 rounded-lg outline outline-1 -outline-offset-1 outline-white/10">
                <div className="space-y-3">
                  <Skeleton height={16} width="50%" />
                  <Skeleton height={32} width="30%" />
                  <div className="flex items-center gap-1">
                    <Skeleton height={12} width={12} rounded="full" />
                    <Skeleton height={12} width="40%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg outline outline-1 -outline-offset-1 outline-white/10">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-white">24</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-gray-400">5 published this month</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg outline outline-1 -outline-offset-1 outline-white/10">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-white">1,234</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-xs text-gray-400">+12% from last month</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg outline outline-1 -outline-offset-1 outline-white/10">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">Messages</p>
                <p className="text-2xl font-bold text-white">8</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-xs text-gray-400">3 unread</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts table loading */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Posts Table Loading</h3>
          <Button
            size="sm"
            onClick={() => {
              setPostsLoading(true)
              setTimeout(() => setPostsLoading(false), 1500)
            }}
          >
            Simulate Loading
          </Button>
        </div>

        {postsLoading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : (
          <div className="bg-gray-800/50 rounded-lg overflow-hidden outline outline-1 -outline-offset-1 outline-white/10">
            <div className="p-4 border-b border-white/10">
              <div className="grid grid-cols-4 gap-4">
                <p className="text-sm font-medium text-gray-300">Title</p>
                <p className="text-sm font-medium text-gray-300">Status</p>
                <p className="text-sm font-medium text-gray-300">Date</p>
                <p className="text-sm font-medium text-gray-300">Actions</p>
              </div>
            </div>
            <div className="divide-y divide-white/10">
              {[
                { title: "Getting Started with React", status: "Published", date: "2024-01-15" },
                { title: "Advanced TypeScript Tips", status: "Draft", date: "2024-01-10" },
                { title: "Building with Next.js", status: "Published", date: "2024-01-05" }
              ].map((post, i) => (
                <div key={i} className="p-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <p className="text-sm text-white">{post.title}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      post.status === 'Published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                    <p className="text-sm text-gray-400">{post.date}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Edit</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inline loading states */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Inline Loading States</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-gray-300 text-sm">Saving post...</span>
          </div>

          <div className="flex items-center gap-2">
            <LoadingDots size="sm" />
            <span className="text-gray-300 text-sm">Uploading image</span>
          </div>

          <div className="flex items-center gap-2">
            <LoadingPulse size="sm" />
            <span className="text-gray-300 text-sm">Connecting to database</span>
          </div>
        </div>
      </div>
    </div>
  )
}