import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { addDays, format, startOfWeek, subMonths } from 'date-fns';
import { useHeatmapData } from '@/hooks/useAnalytics';
import { HeatmapCell } from '@/components/dashboard/HeatmapCell';

const RANGE_MONTHS = 6;

function buildWeekColumns(): Date[][] {
  const start = startOfWeek(subMonths(new Date(), RANGE_MONTHS));
  const end = new Date();
  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  const columns: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }
  return columns;
}

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function ConsistencyHeatmap() {
  const { data, isLoading, error } = useHeatmapData(RANGE_MONTHS);
  const weekColumns = useMemo(() => buildWeekColumns(), []);
  const [selectedDay, setSelectedDay] = useState<{ day: string; count: number } | null>(null);

  if (isLoading) return <Text>Loading heatmap…</Text>;
  if (error) return <Text style={styles.error}>Failed to load: {error.message}</Text>;

  return (
    <View>
      <View style={styles.grid}>
        {weekColumns.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.column}>
            {week.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const count = data?.[key] ?? 0;
              return (
                <HeatmapCell
                  key={key}
                  level={levelForCount(count)}
                  onPress={() => setSelectedDay({ day: key, count })}
                />
              );
            })}
          </View>
        ))}
      </View>
      {selectedDay && (
        <Text style={styles.caption}>
          {selectedDay.day}: {selectedDay.count} set{selectedDay.count === 1 ? '' : 's'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  column: {
    gap: 3,
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    color: '#374151',
  },
  error: {
    color: '#dc2626',
  },
});
