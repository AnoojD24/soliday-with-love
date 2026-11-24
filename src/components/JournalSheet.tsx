import { useState } from 'react'
import type { WorkoutJournal } from '../types/workout'
import { BottomSheet } from './BottomSheet'
import { Pressable } from './ui/Pressable'

const MOODS = ['Glowy', 'Strong', 'Tired-happy', 'Proud', 'Soft']

interface JournalSheetProps {
  open: boolean
  initial?: WorkoutJournal
  onClose: () => void
  onSave: (journal: WorkoutJournal) => void
}

export function JournalSheet({
  open,
  initial,
  onClose,
  onSave,
}: JournalSheetProps) {
  const [mood, setMood] = useState(initial?.mood ?? MOODS[0])
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(
    initial?.difficulty ?? 3,
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')

  return (
    <BottomSheet open={open} title="Workout journal" onClose={onClose}>
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-berry">Mood</legend>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMood(option)}
                className={`touch-target rounded-full px-3 py-2 text-xs font-medium ${
                  mood === option
                    ? 'bg-berry text-cream'
                    : 'bg-blush/70 text-berry'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-berry">
            Difficulty
          </legend>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDifficulty(value)}
                className={`touch-target flex-1 rounded-2xl py-3 text-sm font-medium ${
                  difficulty === value
                    ? 'bg-berry text-cream'
                    : 'bg-white text-berry border border-blush'
                }`}
                aria-label={`Difficulty ${value}`}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-berry">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-blush bg-white px-3 py-3 text-berry"
            placeholder="Anything you want to remember…"
          />
        </label>

        <div className="flex gap-2">
          <Pressable variant="secondary" className="flex-1" onClick={onClose}>
            Skip
          </Pressable>
          <Pressable
            className="flex-1"
            onClick={() =>
              onSave({
                mood,
                difficulty,
                notes: notes.trim() || undefined,
              })
            }
          >
            Save journal
          </Pressable>
        </div>
      </div>
    </BottomSheet>
  )
}
