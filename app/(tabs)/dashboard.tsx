import { Text } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { ProgressiveOverloadChart } from '@/components/dashboard/ProgressiveOverloadChart';
import { SkillProgressionChart } from '@/components/dashboard/SkillProgressionChart';
import { ConsistencyHeatmap } from '@/components/dashboard/ConsistencyHeatmap';

export default function DashboardScreen() {
  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 10 }}>
          Progressive Overload (volume by movement pattern)
        </Text>
        <ProgressiveOverloadChart />
      </Card>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 10 }}>Skill Progression</Text>
        <SkillProgressionChart />
      </Card>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 10 }}>Consistency</Text>
        <ConsistencyHeatmap />
      </Card>
    </Screen>
  );
}
