import { useQuery } from '@tanstack/react-query';
import { fetchSetsForVolumeChart, fetchStaticHoldSets, fetchWorkoutsForHeatmap } from '@/api/analytics';
import { aggregateVolumeByPatternAndWeek, aggregateSkillProgression, aggregateHeatmap } from '@/utils/volume';
import { isoMonthsAgo } from '@/utils/dateHelpers';

export function useVolumeByPattern(rangeMonths = 3) {
  const sinceISO = isoMonthsAgo(rangeMonths);
  return useQuery({
    queryKey: ['analytics', 'volume', rangeMonths],
    queryFn: () => fetchSetsForVolumeChart(sinceISO),
    select: aggregateVolumeByPatternAndWeek,
  });
}

export function useSkillProgression(exerciseId?: string) {
  return useQuery({
    queryKey: ['analytics', 'skill-progression', exerciseId],
    queryFn: () => fetchStaticHoldSets(exerciseId),
    select: aggregateSkillProgression,
  });
}

export function useHeatmapData(rangeMonths = 6) {
  const sinceISO = isoMonthsAgo(rangeMonths);
  return useQuery({
    queryKey: ['analytics', 'heatmap', rangeMonths],
    queryFn: () => fetchWorkoutsForHeatmap(sinceISO),
    select: aggregateHeatmap,
  });
}
