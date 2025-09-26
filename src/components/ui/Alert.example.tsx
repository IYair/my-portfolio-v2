import { Alert } from './Alert'
import { useState } from 'react'

export function AlertExamples() {
  const [showDismissible, setShowDismissible] = useState(true)

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-white">Alert Examples</h2>

      {/* Success Alert with actions */}
      <Alert
        variant="success"
        title="Order completed"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam."
        actions={[
          { label: "View status", onClick: () => console.log("View status") },
          { label: "Dismiss", onClick: () => console.log("Dismiss") }
        ]}
      />

      {/* Warning Alert - Default style */}
      <Alert
        variant="warning"
        title="Attention needed"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum."
      />

      {/* Info Alert - Compact format */}
      <Alert
        variant="info"
        description={
          <div className="flex-1 md:flex md:justify-between">
            <p>A new software update is available. See what&apos;s new in version 2.0.4.</p>
            <p className="mt-3 md:ml-6 md:mt-0">
              <a href="#" className="whitespace-nowrap font-medium text-blue-300 hover:text-blue-200">
                Details
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        }
      />

      {/* Warning Alert - Left accent style */}
      <Alert
        variant="warning"
        style="left-accent"
        description={
          <>
            You have no credits left.{' '}
            <a href="#" className="font-medium text-yellow-300 underline hover:text-yellow-200">
              Upgrade your account to add more credits.
            </a>
          </>
        }
      />

      {/* Success Alert - Dismissible */}
      {showDismissible && (
        <Alert
          variant="success"
          title="Successfully uploaded"
          dismissible
          onDismiss={() => setShowDismissible(false)}
        />
      )}

      {/* Error Alert */}
      <Alert
        variant="error"
        title="Error occurred"
        description="Something went wrong while processing your request. Please try again."
        actions={[
          { label: "Try again", onClick: () => console.log("Retry") },
          { label: "Contact support", onClick: () => console.log("Support") }
        ]}
      />

      {/* Custom content with children */}
      <Alert variant="info" title="Custom Content">
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Feature 1 has been updated</li>
            <li>New dashboard layout available</li>
            <li>Bug fixes and improvements</li>
          </ul>
        </div>
      </Alert>
    </div>
  )
}

// Ejemplos específicos para el admin panel
export function AdminAlertExamples() {
  return (
    <div className="space-y-4">
      {/* Post saved successfully */}
      <Alert
        variant="success"
        title="Post saved successfully"
        description="Your blog post has been published and is now live."
        dismissible
        onDismiss={() => {}}
      />

      {/* Database connection warning */}
      <Alert
        variant="warning"
        style="left-accent"
        description={
          <>
            Database connection is slow. Consider optimizing your queries or{' '}
            <a href="#" className="font-medium underline hover:text-yellow-200">
              checking server status
            </a>
            .
          </>
        }
      />

      {/* Maintenance mode info */}
      <Alert
        variant="info"
        title="Maintenance mode active"
        description="Your site is currently in maintenance mode. Visitors will see the maintenance page."
        actions={[
          { label: "Disable maintenance", onClick: () => {} },
          { label: "Preview site", onClick: () => {} }
        ]}
      />

      {/* Backup failed error */}
      <Alert
        variant="error"
        title="Backup failed"
        description="The automated backup could not be completed. Your data may be at risk."
        actions={[
          { label: "Retry backup", onClick: () => {} },
          { label: "Manual backup", onClick: () => {} }
        ]}
        dismissible
        onDismiss={() => {}}
      />
    </div>
  )
}