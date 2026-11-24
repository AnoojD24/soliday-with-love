interface MuscleFocusTagsProps {
  muscles: string[]
}

export function MuscleFocusTags({ muscles }: MuscleFocusTagsProps) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Muscle focus">
      {muscles.map((muscle) => (
        <li
          key={muscle}
          className="rounded-full bg-blush/70 px-3 py-1 text-xs font-medium text-berry"
        >
          {muscle}
        </li>
      ))}
    </ul>
  )
}
