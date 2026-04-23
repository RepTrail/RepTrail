// Local-First Elite Validator
// Scans Query Keys, Prefetch Registry, and Sync Engine usage

const fs = require('fs')
const path = require('path')

const SRC_DIR = path.resolve(process.cwd(), 'src')

const violations = []

function scanFiles(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)

    if (stat.isDirectory()) {
      scanFiles(full, callback)
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf-8')
      callback(full, content)
    }
  }
}

// 1. Detect hardcoded query keys
function checkHardcodedKeys(file, content) {
  const regex = /\[\s*['\"](.*?)['\"]/g
  let match

  while ((match = regex.exec(content))) {
    // Exclude imports and known constants
    if (!content.includes('QUERY_KEYS') && !file.includes('query-keys.ts') && !file.includes('sync-engine')) {
       // Filter out common things that use brackets but aren't queries
       if (match[1].length > 1 && !match[1].startsWith('/') && !match[1].includes('${')) {
         violations.push(`[HARDKEY] ${file} → Possible hardcoded key: ${match[0]}`)
       }
    }
  }
}

// 2. Detect missing workoutId in status keys
function checkWorkoutStatus(file, content) {
  if (content.includes('workouts.status(userId)')) {
    violations.push(`[STATUS_KEY] ${file} → Missing workoutId in status key`)
  }
}

// 3. Detect invalidations without exact:false
function checkInvalidations(file, content) {
  if (content.includes('invalidateQueries')) {
    if (!content.includes('exact: false')) {
      violations.push(`[INVALIDATION] ${file} → Missing exact:false in invalidateQueries`)
    }
  }
}

// 4. Detect missing prefetch dependencies
function checkPrefetch(file, content) {
  if (file.includes('prefetch-registry')) {
    if (!content.includes('workouts.status')) {
      violations.push(`[PREFETCH] ${file} → Missing workout status prefetch`)
    }
    if (!content.includes('cardio.logs')) {
      violations.push(`[PREFETCH] ${file} → Missing cardio logs prefetch`)
    }
  }
}

// 5. Detect AI not using Outbox
function checkAIOutbox(file, content) {
  if (file.includes('ai') && content.includes('saveParsedData')) {
    if (!content.includes('outbox')) {
      // Small adjustment: our new AI generator uses saveProtocolMutate which uses useOptimisticMutation (which is Outbox)
      // So if it uses saveProtocolMutate it's fine.
      if (!content.includes('saveProtocolMutate')) {
        violations.push(`[AI_OUTBOX] ${file} → AI save bypassing Outbox`)
      }
    }
  }
}

// 6. Detect enabled waterfalls
function checkEnabledFlags(file, content) {
  // Only check in student dashboard components
  if (file.includes('student') && file.includes('dashboard') && content.includes('enabled:')) {
    // Filter out simple enabled checks that aren't waterfalls
    if (content.includes('!!userId') || content.includes('!!workout')) {
       violations.push(`[WATERFALL] ${file} → enabled flag may cause waterfall`)
    }
  }
}

// Run scan
scanFiles(SRC_DIR, (file, content) => {
  checkHardcodedKeys(file, content)
  checkWorkoutStatus(file, content)
  checkInvalidations(file, content)
  checkPrefetch(file, content)
  checkAIOutbox(file, content)
  checkEnabledFlags(file, content)
})

// Report
console.log('\n🧠 Local-First Validator Report\n')

if (violations.length === 0) {
  console.log('✅ No violations found — ELITE READY')
} else {
  violations.forEach(v => console.log('❌ ' + v))
  console.log(`\nTotal Issues: ${violations.length}`)
}
