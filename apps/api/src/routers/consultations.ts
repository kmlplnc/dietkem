import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { consultations } from '@dietkem/db/schema';
import { TRPCError } from '@trpc/server';
import { db } from '@dietkem/db';
import { eq, desc, sql } from 'drizzle-orm';

const consultationSchema = z.object({
  client_id: z.number(),
  consultation_date: z.string(), // ISO date string
  consultation_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  consultation_type: z.enum(['initial', 'follow-up', 'emergency', 'online']),
  notes: z.string().optional(),
  created_by: z.number(),
});

export const consultationsRouter = router({
  create: publicProcedure
    .input(consultationSchema)
    .mutation(async ({ input }) => {
      try {
        const newConsultation = await db.insert(consultations).values({
          client_id: input.client_id,
          consultation_date: new Date(input.consultation_date),
          consultation_time: input.consultation_time,
          consultation_type: input.consultation_type,
          notes: input.notes || null,
          created_by: input.created_by,
          status: 'scheduled',
        }).returning();

        return {
          success: true,
          consultation: newConsultation[0],
          message: 'Görüşme başarıyla oluşturuldu'
        };
      } catch (error) {
        console.error('Consultation creation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşme oluşturulurken bir hata oluştu',
        });
      }
    }),

  getByClientId: publicProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input }) => {
      try {
        const clientConsultations = await db
          .select()
          .from(consultations)
          .where(eq(consultations.client_id, input.client_id))
          .orderBy(desc(consultations.consultation_date));

        return clientConsultations;
      } catch (error) {
        console.error('Get consultations error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşmeler getirilirken bir hata oluştu',
        });
      }
    }),

  getClientStats: publicProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input }) => {
      try {
        const [consultationCount] = await db
          .select({ count: sql`count(*)` })
          .from(consultations)
          .where(eq(consultations.client_id, input.client_id));

        const [lastConsultation] = await db
          .select()
          .from(consultations)
          .where(eq(consultations.client_id, input.client_id))
          .orderBy(desc(consultations.consultation_date))
          .limit(1);

        return {
          totalConsultations: Number(consultationCount?.count || 0),
          lastConsultation: lastConsultation || null
        };
      } catch (error) {
        console.error('Get client consultation stats error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşme istatistikleri getirilirken bir hata oluştu',
        });
      }
    }),

  getAll: publicProcedure
    .query(async () => {
      try {
        const allConsultations = await db
          .select()
          .from(consultations)
          .orderBy(desc(consultations.consultation_date));

        return allConsultations;
      } catch (error) {
        console.error('Get all consultations error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşmeler getirilirken bir hata oluştu',
        });
      }
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['scheduled', 'completed', 'cancelled'])
    }))
    .mutation(async ({ input }) => {
      try {
        const updatedConsultation = await db
          .update(consultations)
          .set({ 
            status: input.status,
            updated_at: new Date()
          })
          .where(eq(consultations.id, input.id))
          .returning();

        if (!updatedConsultation || updatedConsultation.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Görüşme bulunamadı',
          });
        }

        return {
          success: true,
          consultation: updatedConsultation[0],
          message: 'Görüşme durumu güncellendi'
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Update consultation status error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşme durumu güncellenirken bir hata oluştu',
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const deletedConsultation = await db
          .delete(consultations)
          .where(eq(consultations.id, input.id))
          .returning();

        if (!deletedConsultation || deletedConsultation.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Görüşme bulunamadı',
          });
        }

        return {
          success: true,
          message: 'Görüşme başarıyla silindi'
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Delete consultation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Görüşme silinirken bir hata oluştu',
        });
      }
    }),
}); 