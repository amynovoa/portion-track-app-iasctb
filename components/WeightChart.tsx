
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Polyline, Text as SvgText } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';
import { MetricWeight } from '@/types';

interface WeightChartProps {
  data: MetricWeight[];
  days?: 7 | 30;
}

export default function WeightChart({ data, days = 7 }: WeightChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 48;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to display</Text>
        <Text style={styles.emptySubtext}>Add weight entries to see your trend</Text>
      </View>
    );
  }

  // Sort data by date and take last N days
  const sortedData = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);

  if (sortedData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to display</Text>
      </View>
    );
  }

  // Calculate min and max values with padding
  const weights = sortedData.map((d) => d.value);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 10;
  const yMin = minWeight - weightRange * 0.1;
  const yMax = maxWeight + weightRange * 0.1;

  // Calculate chart dimensions
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => {
    return padding.left + (index / Math.max(sortedData.length - 1, 1)) * plotWidth;
  };

  const yScale = (value: number) => {
    return padding.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;
  };

  // Generate points for the line
  const points = sortedData
    .map((d, i) => `${xScale(i)},${yScale(d.value)}`)
    .join(' ');

  // Calculate trendline using linear regression
  const n = sortedData.length;
  const sumX = sortedData.reduce((sum, _, i) => sum + i, 0);
  const sumY = sortedData.reduce((sum, d) => sum + d.value, 0);
  const sumXY = sortedData.reduce((sum, d, i) => sum + i * d.value, 0);
  const sumX2 = sortedData.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const trendStart = intercept;
  const trendEnd = slope * (n - 1) + intercept;

  // Format date for display
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Y-axis labels
  const yLabels = [
    { value: yMax, label: yMax.toFixed(0) },
    { value: (yMax + yMin) / 2, label: ((yMax + yMin) / 2).toFixed(0) },
    { value: yMin, label: yMin.toFixed(0) },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Weight Trend</Text>
        <Text style={styles.chartSubtitle}>Last {days} days</Text>
      </View>

      <Svg width={chartWidth} height={chartHeight}>
        {/* Y-axis grid lines */}
        {yLabels.map((label, i) => (
          <React.Fragment key={i}>
            <Line
              x1={padding.left}
              y1={yScale(label.value)}
              x2={chartWidth - padding.right}
              y2={yScale(label.value)}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <SvgText
              x={padding.left - 8}
              y={yScale(label.value) + 4}
              fontSize="12"
              fill={colors.textSecondary}
              textAnchor="end"
            >
              {label.label}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Trendline */}
        <Line
          x1={xScale(0)}
          y1={yScale(trendStart)}
          x2={xScale(n - 1)}
          y2={yScale(trendEnd)}
          stroke={colors.primary}
          strokeWidth="2"
          strokeDasharray="6,4"
          opacity="0.5"
        />

        {/* Data line */}
        <Polyline
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {sortedData.map((d, i) => (
          <Circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r="5"
            fill={colors.primary}
            stroke={colors.background}
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels (show first, middle, and last) */}
        {sortedData.length > 0 && (
          <>
            <SvgText
              x={xScale(0)}
              y={chartHeight - 10}
              fontSize="11"
              fill={colors.textSecondary}
              textAnchor="start"
            >
              {formatShortDate(sortedData[0].date)}
            </SvgText>
            {sortedData.length > 2 && (
              <SvgText
                x={xScale(Math.floor(sortedData.length / 2))}
                y={chartHeight - 10}
                fontSize="11"
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {formatShortDate(sortedData[Math.floor(sortedData.length / 2)].date)}
              </SvgText>
            )}
            {sortedData.length > 1 && (
              <SvgText
                x={xScale(sortedData.length - 1)}
                y={chartHeight - 10}
                fontSize="11"
                fill={colors.textSecondary}
                textAnchor="end"
              >
                {formatShortDate(sortedData[sortedData.length - 1].date)}
              </SvgText>
            )}
          </>
        )}
      </Svg>

      {/* Trend indicator */}
      <View style={styles.trendContainer}>
        <Text style={styles.trendLabel}>Trend: </Text>
        <Text
          style={[
            styles.trendValue,
            { color: slope < 0 ? colors.success : slope > 0 ? colors.error : colors.textSecondary },
          ]}
        >
          {slope < -0.1 ? '↓ Decreasing' : slope > 0.1 ? '↑ Increasing' : '→ Stable'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
