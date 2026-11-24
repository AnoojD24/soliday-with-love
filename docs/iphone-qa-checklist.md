# Physical iPhone QA checklist

Use after the app is hosted (do not skip this before gifting).

## Install

- [ ] Open the hosted URL in **Safari** (not only Chrome)
- [ ] Share → **Add to Home Screen**
- [ ] Confirm name appears as Soliday ♡ / Soliday With Love
- [ ] Custom blush bow + heart icon looks correct on the home screen
- [ ] Launch from home screen opens **standalone** (no Safari chrome)

## Layout & navigation

- [ ] Safe areas look correct (notch / Dynamic Island / home indicator)
- [ ] Bottom nav never covers primary actions
- [ ] No horizontal scrolling at iPhone SE / 13 / 15 widths
- [ ] Calendar cells remain readable

## Core flows

- [ ] First launch shows gift unwrap once
- [ ] Refresh / relaunch does not force unwrap again
- [ ] Replay gift (With Love) does not erase workouts
- [ ] Complete a workout → hearts / progress update
- [ ] Undo completion works
- [ ] Dec 13 flexible choice works; cancel reminder stays until confirmed
- [ ] Open When letters open with zero completed workouts
- [ ] Milestone letters unlock at thresholds and can be reread

## Offline

- [ ] Open online once so the service worker caches
- [ ] Enable Airplane Mode
- [ ] Relaunch from home screen
- [ ] Home / Calendar / Progress / With Love still open
- [ ] Complete or edit a workout offline; data remains after refresh

## Calendar export

- [ ] Export a planned workout `.ics` and open in Apple Calendar
- [ ] Export decision reminders for a flexible day
- [ ] Confirm times match America/Los_Angeles expectations

## Backup

- [ ] Export JSON from Settings
- [ ] Import JSON and confirm progress restores

## Update

- [ ] After a new deploy, soft update prompt appears
- [ ] Refresh keeps LocalStorage data
