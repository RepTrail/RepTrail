import { getTrainerRanking } from '../src/actions/trainer-actions'
import fs from 'fs'

async function run() {
    const data = await getTrainerRanking()
    fs.writeFileSync('C:\\Users\\Marcos\\.gemini\\antigravity-ide\\brain\\9656fa54-aaec-4d5e-aa19-7e3518e40a5d\\scratch\\output.json', JSON.stringify(data, null, 2))
}

run()
