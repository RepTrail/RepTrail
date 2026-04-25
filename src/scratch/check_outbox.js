
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkOutbox() {
    // We can't easily check IndexedDB from Node, but we can check if the server has pending actions
    console.log('Outbox check usually happens in the browser console.');
    console.log('Please open Browser Console (F12) and type: await outboxDB.getAll()');
}

checkOutbox();
