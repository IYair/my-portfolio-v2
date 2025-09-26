import { useState } from 'react'
import { ProgressStepper, Step } from './ProgressStepper'

// Ejemplo para setup inicial del admin
export function AdminSetupProgressExample() {
  const [currentStepIndex, setCurrentStepIndex] = useState(1)

  const setupSteps: Step[] = [
    {
      name: 'Create account',
      description: 'Set up your admin credentials',
      status: currentStepIndex > 0 ? 'complete' : 'current',
      onClick: () => setCurrentStepIndex(0)
    },
    {
      name: 'Profile information',
      description: 'Add your personal details and bio',
      status: currentStepIndex > 1 ? 'complete' : currentStepIndex === 1 ? 'current' : 'upcoming',
      onClick: () => currentStepIndex >= 1 && setCurrentStepIndex(1)
    },
    {
      name: 'Site configuration',
      description: 'Configure site settings and preferences',
      status: currentStepIndex > 2 ? 'complete' : currentStepIndex === 2 ? 'current' : 'upcoming',
      onClick: () => currentStepIndex >= 2 && setCurrentStepIndex(2)
    },
    {
      name: 'Theme customization',
      description: 'Customize colors and layout',
      status: currentStepIndex > 3 ? 'complete' : currentStepIndex === 3 ? 'current' : 'upcoming',
      onClick: () => currentStepIndex >= 3 && setCurrentStepIndex(3)
    },
    {
      name: 'Review & launch',
      description: 'Preview your site before going live',
      status: currentStepIndex > 4 ? 'complete' : currentStepIndex === 4 ? 'current' : 'upcoming',
      onClick: () => currentStepIndex >= 4 && setCurrentStepIndex(4)
    },
  ]

  const handleNext = () => {
    if (currentStepIndex < setupSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  return (
    <div className="flex gap-8">
      {/* Progress Stepper */}
      <div className="w-80">
        <h2 className="text-lg font-semibold text-white mb-4">Setup Progress</h2>
        <ProgressStepper steps={setupSteps} />
      </div>

      {/* Current step content */}
      <div className="flex-1 bg-gray-800/50 rounded-lg p-6 outline outline-1 -outline-offset-1 outline-white/10">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">
            {setupSteps[currentStepIndex].name}
          </h3>
          <p className="text-gray-400 mt-1">
            {setupSteps[currentStepIndex].description}
          </p>
        </div>

        {/* Step-specific content */}
        <div className="mb-8">
          {currentStepIndex === 0 && (
            <div className="space-y-4">
              <p className="text-gray-300">Welcome! Let&apos;s set up your admin account.</p>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="email"
                  placeholder="Admin email"
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
          )}

          {currentStepIndex === 1 && (
            <div className="space-y-4">
              <p className="text-gray-300">Tell us about yourself.</p>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <textarea
                  placeholder="Bio"
                  rows={3}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
          )}

          {currentStepIndex === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300">Configure your site settings.</p>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Site title"
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <input
                  type="text"
                  placeholder="Site description"
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
          )}

          {currentStepIndex === 3 && (
            <div className="space-y-4">
              <p className="text-gray-300">Customize your theme.</p>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-md cursor-pointer"></div>
                <div className="w-12 h-12 bg-green-500 rounded-md cursor-pointer"></div>
                <div className="w-12 h-12 bg-purple-500 rounded-md cursor-pointer"></div>
                <div className="w-12 h-12 bg-red-500 rounded-md cursor-pointer"></div>
              </div>
            </div>
          )}

          {currentStepIndex === 4 && (
            <div className="space-y-4">
              <p className="text-gray-300">Review your configuration and launch your site.</p>
              <div className="bg-gray-700 p-4 rounded-md">
                <h4 className="font-medium text-white mb-2">Summary</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Admin account created</li>
                  <li>✓ Profile information added</li>
                  <li>✓ Site configured</li>
                  <li>✓ Theme customized</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === setupSteps.length - 1}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStepIndex === setupSteps.length - 1 ? 'Launch' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Ejemplo simple para publicación de posts
export function PostPublishProgressExample() {
  const [publishStep, setPublishStep] = useState(1)

  const publishSteps: Step[] = [
    {
      name: 'Draft created',
      description: 'Post saved as draft',
      status: 'complete'
    },
    {
      name: 'Content review',
      description: 'Review content and formatting',
      status: publishStep >= 1 ? 'current' : 'upcoming'
    },
    {
      name: 'SEO optimization',
      description: 'Add meta description and tags',
      status: publishStep >= 2 ? 'current' : 'upcoming'
    },
    {
      name: 'Publish',
      description: 'Make post live on your site',
      status: publishStep >= 3 ? 'current' : 'upcoming'
    },
  ]

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold text-white mb-4">Publishing Progress</h3>
      <ProgressStepper steps={publishSteps} />

      <div className="mt-6 space-x-2">
        <button
          onClick={() => setPublishStep(Math.max(0, publishStep - 1))}
          className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => setPublishStep(Math.min(3, publishStep + 1))}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  )
}