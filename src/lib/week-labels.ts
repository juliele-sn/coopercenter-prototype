// Global helpers for the week-aware date switcher. The labels are the same
// everywhere this prototype renders a "pick a week" control:
//
//   • This Week / Last Week / Next Week — for the three weeks around today
//   • Apr 26 - May 2                    — for any other week in the pay history
//
// `weekOffset` is signed: 0 = current week, -1 = last week, +1 = next, etc.

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const weekRangeLabel = (weekStart: Date): string => {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return `${MONTH_ABBR[start.getMonth()]} ${start.getDate()} – ${MONTH_ABBR[end.getMonth()]} ${end.getDate()}`;
};

export const weekSwitcherLabel = (weekOffset: number, weekStart: Date): string => {
  if (weekOffset === 0) return 'This Week';
  if (weekOffset === -1) return 'Last Week';
  if (weekOffset === 1) return 'Next Week';
  return weekRangeLabel(weekStart);
};
