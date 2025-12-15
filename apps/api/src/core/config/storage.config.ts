import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || 'uploads',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
}));
