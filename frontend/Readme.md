## Game Session 

current concept 

AIM TRAINING SESSION
- startTime
- duration (20s / 30s)
- shotsFired
- shotsHit
- accuracy
- score
- difficulty



## needed fixing later 

### ⚠️ What needed fixing

- Refs in dependency arrays

- Broken return object

- Missing props

- Effect lifecycle ordering



### state game phases (4 )
```
BOOT
 ↓
HOME (Start Screen)
 ↓
CALIBRATION (20 sec)
 ↓
LIVE GAME (Adaptive)
```



## Currently Implemented so far

```
HOME
↓
CALIBRATION (20s)
↓
LIVE (60s)
↓
END
```

## 🎯 Purpose of Each <br>
### CALIBRATION

- Collect raw player skill 
- No difficulty yet
- No pressure
- Data only
### LIVE
- Difficulty is locked
- Full scoring
- Adaptive systems apply here
### END
- Freeze input
- Show results
- Send data to backend (later)


</br>

# Difficulty Metrics 

From calibration stats:

```js
shotsFired
shotsHit
timeSpent
```

We compute:

- Accuracy
```js
accuracy = shotsHit / shotsFired
```

- Fire Rate
```js
shotsPerSecond = shotsFired / 20
```

## Difficulty Rules

```txt
EASY:
  accuracy < 0.30 OR shotsPerSecond < 1.2

MEDIUM:
  accuracy 0.30–0.60 AND shotsPerSecond 1.2–2.5

HARD:
  accuracy > 0.60 AND shotsPerSecond > 2.5

```


## Architectural Flow 

```bash
AimTrainingScene
 └── useGameLoop
       ├── statsRef (shots, hits, reactionTimes)
       ├── timer & phase
       └── exposes recordShot / recordHit / recordReaction
 └── TargetSpawner
       ├── owns target lifecycle
       ├── computes reaction time
       └── reports hit/miss UP
 └── difficultySystem
       ├── pure evaluation
       └── no side effects
```



## New Adaptive system Chnage 

### First Time Users

```
HOME → CALIBRATION → evaluateDifficulty → LIVE (Easy / Medium / Hard)

```

### After Live Round Ends

```
evaluateLiveDifficulty
↓
Easy → Easy+ → Easy++ → Medium → Medium+ → Hard

```



