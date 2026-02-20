import React from 'react'
import { completedFeatures, plannedFeatures } from '../../data'

export const ChangelogInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="pt-3 border-t border-slate-200">
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-slate-800">Планы на будущее</h4>
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
        <h4 className="text-lg font-medium text-slate-800">Что было сделано</h4>
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
