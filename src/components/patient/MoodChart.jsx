import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function MoodChart({ data = [], height = 100 }) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#6B7280' }}
          tickFormatter={(date) => format(new Date(date), 'EEE', { locale: es })}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          formatter={(value) => [`${value}/10`, 'Ánimo']}
          labelFormatter={(date) => format(new Date(date), "d 'de' MMM", { locale: es })}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#2D6A4F"
          strokeWidth={2.5}
          dot={{ fill: '#2D6A4F', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}