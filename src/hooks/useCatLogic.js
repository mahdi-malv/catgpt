import { useState, useCallback } from 'react'

// ── Vocabulary ────────────────────────────────────────────────────────────────

const VOCAB = {
  normal: {
    words: [
      'meow', 'mew', 'mrow', 'mrrp', 'prrt', 'meOW', 'mew?', 'mrow.',
      'MEOW', 'mrrow', 'mrrrow', '*licks paw*', '*stares*',
      '*knocks thing off table*', '*blinks slowly*', '*sits on keyboard*',
      '*yawns*', '*ignores you*', '*stares at wall*',
    ],
    prefix: [],
    suffix: ['purr...', '*curls up*', '*walks away*'],
  },
  happy: {
    words: [
      'PURRRR', 'purrr', 'prrrrt', 'mrrrrp', '*headbutt*', '*kneading*',
      '*purring intensifies*', 'prrr', '*happy chirp*', 'brrrp!',
      'prrrt!', '*rolls over*', '*shows belly*', '*makes biscuits*',
    ],
    prefix: ['*purring* '],
    suffix: ['*falls asleep purring*', 'purrrrrrr...', '*nuzzles*'],
  },
  grumpy: {
    words: [
      'HISSS', 'hiss', '*swats*', '*glares*', 'MREOW', '*flattens ears*',
      '*tail flick*', 'hsssss', '*bites*', 'HSSST', '*growl*',
      '*knocks your water off the desk*', 'NO.', '*death stare*',
    ],
    prefix: ['*hiss* '],
    suffix: ['*walks away with tail up*', 'HISS.', '*knocks lamp over*'],
  },
}

// ── Mood selection ────────────────────────────────────────────────────────────

function pickMood() {
  const roll = Math.random()
  if (roll < 0.80) return 'normal'
  if (roll < 0.90) return 'happy'
  return 'grumpy'
}

// ── Word count correlation ────────────────────────────────────────────────────

function calculateWordCount(inputText) {
  const inputWords = inputText.trim().split(/\s+/).length
  const base = Math.max(3, Math.floor(inputWords * 1.5))
  const jitter = Math.floor(Math.random() * 5) - 2
  return Math.min(Math.max(3, base + jitter), 30)
}

// ── Response builder ──────────────────────────────────────────────────────────

function buildResponse(mood, wordCount) {
  const { words, prefix, suffix } = VOCAB[mood]
  const pick = () => words[Math.floor(Math.random() * words.length)]

  const parts = []
  if (prefix.length && Math.random() > 0.5) parts.push(prefix[0])

  // Avoid consecutive identical words for natural variation
  let prev = null
  for (let i = 0; i < wordCount; i++) {
    let word
    let attempts = 0
    do {
      word = pick()
      attempts++
    } while (word === prev && attempts < 5)
    parts.push(word)
    prev = word
  }

  if (suffix.length && Math.random() > 0.7) {
    parts.push(suffix[Math.floor(Math.random() * suffix.length)])
  }

  return parts.join(' ')
}

// ── GIF URL generator ─────────────────────────────────────────────────────────

export function getCatGifUrl() {
  return `https://cataas.com/cat/gif?t=${Date.now()}`
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCatLogic() {
  const [isStreaming, setIsStreaming] = useState(false)

  const streamResponse = useCallback((userMessage, onToken, onComplete) => {
    setIsStreaming(true)

    const mood = pickMood()
    const wordCount = calculateWordCount(userMessage)
    const fullResponse = buildResponse(mood, wordCount)
    const words = fullResponse.split(' ')

    let index = 0

    const intervalId = setInterval(() => {
      if (index < words.length) {
        const accumulated = words.slice(0, index + 1).join(' ')
        onToken(accumulated)
        index++
      } else {
        clearInterval(intervalId)
        setIsStreaming(false)
        onComplete()
      }
    }, 70)

    // Return cleanup for unmount safety
    return () => {
      clearInterval(intervalId)
      setIsStreaming(false)
    }
  }, [])

  return { isStreaming, streamResponse }
}
