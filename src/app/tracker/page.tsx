import { fetchMonthSnapshot } from './actions';
import DailyTrackerClient from './DailyTrackerClient';

export default async function TrackerPage() {
  const now = new Date();
  const initial = await fetchMonthSnapshot(now.getUTCFullYear(), now.getUTCMonth());

  return (
    <DailyTrackerClient
      year={now.getUTCFullYear()}
      monthIndex0={now.getUTCMonth()}
      initialMonthMap={initial}
    />
  );
}
