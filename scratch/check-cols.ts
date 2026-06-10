import { adminClient } from '../src/lib/supabase/admin'

async function getCols() {
  const { data, error } = await adminClient
    .from('plans')
    .select('*')
    .limit(1)
  console.log(data ? Object.keys(data[0] || {}) : error)
  const { data: fData, error: fError } = await adminClient
    .from('plan_features_dynamic')
    .select('*')
    .limit(1)
  console.log(fData ? Object.keys(fData[0] || {}) : fError)
}

getCols()
