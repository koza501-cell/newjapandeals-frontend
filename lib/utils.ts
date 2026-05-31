const CONDITION_MAP: Record<string, string> = {
  'Working Junk':        'Working — Sold As-Is',
  'Junk':                'Sold As-Is',
  'JUNK FOR PARTS':      'For Parts — As-Is',
  'JUNK DAMAGED':        'Damaged — As-Is',
  'For parts - Untested':'Untested — As-Is',
  'Junk/Damaged':        'Damaged — As-Is',
};

export function normalizeConditionLabel(raw: string): string {
  if (!raw) return raw;
  if (CONDITION_MAP[raw]) return CONDITION_MAP[raw];
  const lower = raw.toLowerCase();
  for (const [key, val] of Object.entries(CONDITION_MAP)) {
    if (key.toLowerCase() === lower) return val;
  }
  if (lower.includes('junk')) {
    return raw.replace(/junk/gi, 'As-Is');
  }
  return raw;
}

const AS_IS_TOOLTIP = 'Sold in current condition. Please review photos and description carefully.';

export function conditionTooltip(normalizedLabel: string): string | undefined {
  return normalizedLabel.includes('As-Is') ? AS_IS_TOOLTIP : undefined;
}
