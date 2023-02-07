import React from 'react'
import { CHART_OPTIONS } from '../../helpers'
import { Bar, Doughnut, Line, Pie, PolarArea } from 'react-chartjs-2'
import { useMediaQuery } from 'react-responsive'

const Charts = ({ type, getElementAtEvent, data }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  return (
    <div style={{ padding: `0 ${type !== 'bar' && type !== 'line' ? isMobile ? '14%' : '24%' : 0}` }}>
      {type === 'bar' && (
        <Bar
          data={data}
          getElementAtEvent={getElementAtEvent}
          options={CHART_OPTIONS}
        />
      )}
      {type === 'line' && (
        <Line
          data={data}
          getElementAtEvent={getElementAtEvent}
          options={CHART_OPTIONS}
        />
      )}
      {type === 'doughnut' && (
        <Doughnut
          data={data}
          getElementAtEvent={getElementAtEvent}
        />
      )}
      {type === 'pie' && (
        <Pie
          data={data}
          getElementAtEvent={getElementAtEvent}
        />
      )}
      {type === 'polar' && (
        <PolarArea
          data={data}
          getElementAtEvent={getElementAtEvent}
        />
      )}
    </div>
  )
}

export default Charts
