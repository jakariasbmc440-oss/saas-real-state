import { TRANSACTION_TYPES, API_BASE_URL } from '../config/constants.js';

export const DEMO_MODE = true;

const defaultUsers = [
  { user_id: 'USR001', name: 'Admin User', role: 'COMPANY_ADMIN', email: 'admin@demo.com', password: 'demo123', store_id: 'STR001', company_id: 'CMP001', status: 'ACTIVE' },
  { user_id: 'USR002', name: 'Rahim Khan', role: 'MANAGER', email: 'manager@demo.com', password: 'demo123', store_id: 'STR001', company_id: 'CMP001', status: 'ACTIVE' },
  { user_id: 'USR003', name: 'Karim Ahmed', role: 'STAFF', email: 'staff@demo.com', password: 'demo123', store_id: 'STR002', company_id: 'CMP001', status: 'ACTIVE' },
  { user_id: 'USR004', name: 'Sara Begum', role: 'VIEWER', email: 'viewer@demo.com', password: 'demo123', store_id: 'STR001', company_id: 'CMP001', status: 'ACTIVE' }
];

export async function apiCall(action, payload = {}) {
  const token = localStorage.getItem('token');
  
  if (DEMO_MODE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (action) {
          case 'login': {
            const { email, password } = payload;
            if (!email || !password) {
              return reject(new Error('ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন (Email and password are required)'));
            }

            // Read the latest persisted users from local storage
            let currentUsers = defaultUsers;
            try {
              const saved = localStorage.getItem('storeiq_saas_data_v1');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.users && parsed.users.length > 0) {
                  currentUsers = parsed.users;
                }
              }
            } catch (e) {
              console.error('Failed to read users store', e);
            }

            const cleanEmail = email.trim().toLowerCase();
            const user = currentUsers.find(u => (u.email || '').trim().toLowerCase() === cleanEmail);

            if (!user) {
              return reject(new Error('ভুল ইমেইল! এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। (User not found)'));
            }

            if (user.status !== 'ACTIVE') {
              return reject(new Error('এই অ্যাকাউন্টটি নিষ্ক্রিয় (Inactive) করা আছে। অ্যাডমিনের সাথে যোগাযোগ করুন।'));
            }

            // Strict password check: MUST match user's current password exactly
            const expectedPassword = user.password || 'demo123';
            if (password !== expectedPassword) {
              return reject(new Error('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন। (Incorrect password)'));
            }

            const safeUser = { ...user };
            delete safeUser.password;
            delete safeUser.password_hash;

            resolve({
              user: safeUser,
              token: `auth_token_${safeUser.user_id}_${Date.now()}`
            });
            break;
          }

          default:
            resolve({});
        }
      }, 300);
    });
  }

  const endpoint = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, payload, token })
    });
    const result = await response.json();
    if (result.success === false) {
      throw new Error(result.error?.message || result.error || 'API Error');
    }
    return result.data;
  } catch (err) {
    console.error('API call failed', err);
    throw err;
  }
}

export const api = {
  get: (action, params) => apiCall(action, params),
  post: (action, data) => apiCall(action, data)
};
