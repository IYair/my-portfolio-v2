import { Tooltip } from './Tooltip'
import Button from './Button'
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/20/solid'

export function TooltipExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-xl font-semibold text-white">Tooltip Examples</h2>

      {/* Basic tooltips with different placements */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Placement Examples</h3>
        <div className="flex items-center justify-center gap-8 p-8 bg-gray-900/50 rounded-lg">
          <Tooltip content="This tooltip appears on top" placement="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>

          <Tooltip content="This tooltip appears on the right" placement="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>

          <Tooltip content="This tooltip appears at the bottom" placement="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>

          <Tooltip content="This tooltip appears on the left" placement="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
        </div>
      </div>

      {/* Tooltips with icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Icon Tooltips</h3>
        <div className="flex items-center gap-4">
          <Tooltip content="Get more information about this feature">
            <InformationCircleIcon className="w-5 h-5 text-blue-400 cursor-help" />
          </Tooltip>

          <Tooltip content="Click here for help documentation" placement="right">
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 cursor-help" />
          </Tooltip>

          <Tooltip content="Warning: This action cannot be undone" placement="bottom">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 cursor-help" />
          </Tooltip>

          <Tooltip content="Open settings panel">
            <Cog6ToothIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          </Tooltip>
        </div>
      </div>

      {/* Admin panel action tooltips */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Admin Panel Actions</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg outline outline-1 -outline-offset-1 outline-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Blog Post Title</h4>
              <p className="text-gray-400 text-sm">Published 2 days ago</p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Preview post" delay={100}>
                <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Edit post" delay={100}>
                <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete post (cannot be undone)" placement="left" delay={100}>
                <button className="p-2 text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/10">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Complex content tooltip */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Rich Content Tooltip</h3>
        <div className="flex items-center gap-4">
          <Tooltip
            content={
              <div className="max-w-xs">
                <p className="font-medium mb-1">Database Status</p>
                <p className="text-xs text-gray-300 mb-2">Connected to MySQL RDS</p>
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-green-400">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span>3/100</span>
                  </div>
                </div>
              </div>
            }
            placement="right"
            contentClassName="!whitespace-normal"
          >
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-md cursor-help">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm">Database Connected</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Form field tooltips */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Form Field Helpers</h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              Post Slug
              <Tooltip content="URL-friendly version of your title. Only letters, numbers, and hyphens allowed." placement="right">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </label>
            <input
              type="text"
              placeholder="my-awesome-post"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              SEO Title
              <Tooltip content="Optimal length: 50-60 characters. This appears in search results." placement="right">
                <InformationCircleIcon className="w-4 h-4 text-blue-400" />
              </Tooltip>
            </label>
            <input
              type="text"
              placeholder="Enter SEO title..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
      </div>

      {/* Disabled tooltip */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Disabled State</h3>
        <div className="flex gap-4">
          <Tooltip content="This tooltip is disabled" disabled>
            <Button variant="secondary">Disabled Tooltip</Button>
          </Tooltip>

          <Tooltip content="This tooltip works normally">
            <Button variant="secondary">Normal Tooltip</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

// Ejemplos específicos para diferentes casos de uso
export function AdminTooltipUseCases() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-white">Admin Panel Use Cases</h2>

      {/* Status indicators */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Status Indicators</h3>
        <div className="flex gap-4">
          <Tooltip content="All systems operational">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-white">Online</span>
            </div>
          </Tooltip>

          <Tooltip content="Maintenance mode active until 3:00 PM">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-white">Maintenance</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Metric explanations */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Metrics with Explanations</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Bounce Rate</span>
            <div className="flex items-center gap-1">
              <span className="text-white font-medium">32%</span>
              <Tooltip content="Percentage of visitors who leave after viewing only one page. Lower is better.">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Session Duration</span>
            <div className="flex items-center gap-1">
              <span className="text-white font-medium">2m 34s</span>
              <Tooltip content="Average time users spend on your site per session. Higher indicates better engagement.">
                <InformationCircleIcon className="w-4 h-4 text-blue-400" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}