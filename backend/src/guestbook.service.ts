import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(dto: { name: string; message: string }) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([dto])
      .select();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: { name?: string; message?: string }) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .update(dto)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('guestbook')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
}