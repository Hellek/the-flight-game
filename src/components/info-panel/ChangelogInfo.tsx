import { Heading } from '@components/ui'
import { completedFeatures, plannedFeatures } from '@data'

export const ChangelogInfo = () => {
  return (
    <div className="space-y-4">
      <div className="pt-3 border-t border-slate-200">
        <div className="space-y-3">
          <Heading level={4}>Планы на будущее</Heading>
          <div className="space-y-2 text-sm text-slate-600">
            {plannedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">🔮</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Heading level={4}>Что было сделано</Heading>
        <div className="space-y-2 text-sm text-slate-600">
          {completedFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
