export type ChecklistSection = { title: string; items: { id: string; text: string }[] };

export const DAILY_TEMPLATE: ChecklistSection[] = [
  {
    title: 'Discipline',
    items: [
      { id: 'no_game', text: 'No Game' },
      { id: 'no_smoke', text: 'No Smoke' },
      { id: 'phone_off_workout', text: 'Phone off during workout' },
      { id: 'miss_once_never_twice', text: 'Miss once, never twice' },
    ],
  },
  {
    title: 'Training',
    items: [
      { id: 'workout_done', text: 'Workout done' },
      { id: 'mindset_3', text: '3× Mindset habits' },
    ],
  },
  {
    title: 'Nutrition',
    items: [
      { id: 'protein_130', text: 'Protein ≥ 130g' },
      { id: 'creatine_5g', text: 'Creatine 5g' },
    ],
  },
];
export const ALL_ITEM_IDS = DAILY_TEMPLATE.flatMap(s => s.items.map(i => i.id));
