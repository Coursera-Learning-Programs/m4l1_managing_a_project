import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from 'victory-native';
import { useSkillProgression } from '@/hooks/useAnalytics';

const VARIATION_COLORS = ['#1d4ed8', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'];

function colorForVariation(variation: string | null, order: string[]): string {
  const index = variation ? order.indexOf(variation) : -1;
  return VARIATION_COLORS[index % VARIATION_COLORS.length] ?? '#6b7280';
}

export function SkillProgressionChart() {
  const { data, isLoading, error } = useSkillProgression();
  const chartWidth = Math.min(Dimensions.get('window').width - 32, 500);

  if (isLoading) return <Text>Loading skill progression…</Text>;
  if (error) return <Text style={styles.error}>Failed to load: {error.message}</Text>;
  if (!data || Object.keys(data).length === 0) return <Text>No static hold sets logged yet.</Text>;

  return (
    <View style={styles.container}>
      {Object.entries(data).map(([exerciseName, points]) => {
        const variationOrder = Array.from(new Set(points.map((p) => p.variation ?? 'default')));
        return (
          <View key={exerciseName} style={styles.exerciseBlock}>
            <Text style={styles.exerciseTitle}>{exerciseName}</Text>
            <VictoryChart width={chartWidth} height={220} domainPadding={{ x: 20, y: 10 }}>
              <VictoryAxis
                tickFormat={(date: string) => date.slice(5, 10)}
                style={{ tickLabels: { fontSize: 10, angle: -30 } }}
              />
              <VictoryAxis dependentAxis label="seconds" />
              <VictoryLine
                data={points.map((p) => ({ x: p.date, y: p.hold_time_seconds }))}
                style={{ data: { stroke: '#9ca3af' } }}
              />
              <VictoryScatter
                data={points.map((p) => ({
                  x: p.date,
                  y: p.hold_time_seconds,
                  variation: p.variation ?? 'default',
                  isVariationTransition: p.isVariationTransition,
                }))}
                size={(props) => (props.datum?.isVariationTransition ? 7 : 4)}
                style={{
                  data: {
                    fill: (props) => colorForVariation(props.datum?.variation ?? null, variationOrder),
                  },
                }}
              />
            </VictoryChart>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  exerciseBlock: {
    gap: 4,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  error: {
    color: '#dc2626',
  },
});
