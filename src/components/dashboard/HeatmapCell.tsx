import { Pressable, StyleSheet } from 'react-native';

const LEVEL_COLORS = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

interface HeatmapCellProps {
  level: number;
  onPress?: () => void;
}

export function HeatmapCell({ level, onPress }: HeatmapCellProps) {
  const color = LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)];
  return <Pressable onPress={onPress} style={[styles.cell, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  cell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
