/** Apple Maps place links for Soliday studios. */
export const STUDIO_MAP_LINKS: Record<string, string> = {
  'Woodland Hills': 'https://maps.apple/p/6QAA7Aq8un8n~0',
  'Costa Mesa': 'https://maps.apple/p/-y..SWNZ-4Guur',
}

export function getStudioMapLink(location: string): string | undefined {
  return STUDIO_MAP_LINKS[location]
}
