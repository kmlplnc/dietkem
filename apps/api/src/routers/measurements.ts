import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { measurements } from '@dietkem/db';
import { eq, desc, sql } from 'drizzle-orm';

const addMeasurementSchema = z.object({
  client_id: z.number().min(1, 'Danışan ID gerekli'),
  weight_kg: z.number().min(0, 'Kilo 0\'dan büyük olmalı').max(500, 'Kilo 500\'den küçük olmalı'),
  waist_cm: z.number().min(0).max(300).optional(),
  hip_cm: z.number().min(0).max(300).optional(),
  neck_cm: z.number().min(0).max(100).optional(),
  chest_cm: z.number().min(0).max(300).optional(),
  arm_cm: z.number().min(0).max(100).optional(),
  thigh_cm: z.number().min(0).max(200).optional(),
  body_fat_percent: z.number().min(0).max(100).optional(),
  measured_at: z.string().optional(), // ISO date string
  note: z.string().max(1000).optional(),
});

export const measurementsRouter = router({
  add: protectedProcedure
    .input(addMeasurementSchema)
    .mutation(async ({ input, ctx }) => {
      const { client_id, weight_kg, measured_at, ...rest } = input;
      
      // Use raw SQL to avoid type issues
      const measurementData = {
        client_id,
        weight_kg,
        measured_at: measured_at || new Date().toISOString().split('T')[0],
        ...rest,
      };

      // Use raw SQL insert to avoid type issues
      const result = await ctx.db.execute(
        sql`INSERT INTO measurements (client_id, weight_kg, measured_at, waist_cm, hip_cm, neck_cm, chest_cm, arm_cm, thigh_cm, body_fat_percent, note, created_at) 
            VALUES (${measurementData.client_id}, ${measurementData.weight_kg}, ${measurementData.measured_at}, ${measurementData.waist_cm || null}, ${measurementData.hip_cm || null}, ${measurementData.neck_cm || null}, ${measurementData.chest_cm || null}, ${measurementData.arm_cm || null}, ${measurementData.thigh_cm || null}, ${measurementData.body_fat_percent || null}, ${measurementData.note || null}, NOW()) 
            RETURNING *`
      );
      
      return {
        success: true,
        measurement: result[0],
        message: 'Ölçüm başarıyla eklendi'
      };
    }),

  getByClientId: protectedProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { client_id } = input;
      
      // Use raw SQL to avoid type issues
      const clientMeasurements = await ctx.db.execute(
        sql`SELECT * FROM measurements WHERE client_id = ${client_id} ORDER BY measured_at DESC`
      );
      
      return clientMeasurements;
    }),
}); 