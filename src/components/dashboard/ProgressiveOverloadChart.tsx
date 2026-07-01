import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { VictoryChart, VictoryGroup, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import { useVolumeByPattern } from '@/hooks/useAnalytics';
import { MOVEMENT_PATTERNS } from '@/utils/volume';

const PATTERN_COLORS: Record<string, string> = {
  PUSH: '#dc2626',
  PULL: '#1d4ed8',
  CORE: '#059669',
  LEGS: '#d97706',
};

export function ProgressiveOverloadChart() {
  const { data, isLoading, error } = useVolumeByPattern();
  const chartWidth = Math.min(Dimensions.get('window').width - 32, 500);

  if (isLoading) return <Text>Loading volume chart…</Text>;
  if (error) return <Text style={styles.error}>Failed to load: {error.message}</Text>;
  if (!data || data.length === 0) return <Text>No completed sets yet.</Text>;

  return (
    <View>
      <VictoryChart width={chartWidth} height={260} domainPadding={{ x: 20, y: 10 }}>
        <VictoryAxis
          tickFormat={(week: string) => week.slice(5)}
          style={{ tickLabels: { fontSize: 10, angle: -30 } }}
        />
        <VictoryAxis dependentAxis />
        <VictoryGroup>
          {MOVEMENT_PATTERNS.map((pattern) => (
            <VictoryLine
              key={pattern}
              data={data.map((point) => ({ x: point.week, y: point[pattern] }))}
              style={{ data: { stroke: PATTERN_COLORS[pattern] } }}
            />
          ))}
        </VictoryGroup>
      </VictoryChart>
      <VictoryLegend
        orientation="horizontal"
        width={chartWidth}
        gutter={16}
        data={MOVEMENT_PATTERNS.map((pattern) => ({
          name: pattern,
          symbol: { fill: PATTERN_COLORS[pattern] },
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: '#dc2626',
  },
});
