import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { clients } from '@dietkem/db/schema';
import { TRPCError } from '@trpc/server';
import { db } from '@dietkem/db';
import { sql, eq } from 'drizzle-orm';

const clientSchema = z.object({
  name: z.string().min(2),
  gender: z.string().max(50).optional(),
  birth_date: z.string().optional(), // ISO string for timestamp
  height_cm: z.union([z.string(), z.number()]).optional(), // decimal can be string or number
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  diseases: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  activity_level: z.string().optional(),
});

export const clientsRouter = router({
  create: publicProcedure
    .input(clientSchema)
    .mutation(async ({ input }) => {
      try {
        const newClient = await db.insert(clients).values({
          name: input.name, // required
          gender: input.gender || null,
          birth_date: input.birth_date ? new Date(input.birth_date) : null,
          height_cm: input.height_cm !== undefined ? String(input.height_cm) : null,
          email: input.email || null,
          phone: input.phone || null,
          notes: input.notes || null,
          diseases: input.diseases ? JSON.stringify(input.diseases) : null,
          allergies: input.allergies ? JSON.stringify(input.allergies) : null,
          medications: input.medications ? JSON.stringify(input.medications) : null,
          activity_level: input.activity_level || null,
          status: 'active',
        }).returning();

        return {
          success: true,
          client: newClient[0],
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışan oluşturulurken bir hata oluştu',
        });
      }
    }),

  getAll: publicProcedure
    .query(async () => {
      try {
        const allClients = await db.select().from(clients).where(eq(clients.status, 'active')).orderBy(clients.created_at);
        return allClients;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışanlar getirilirken bir hata oluştu',
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const client = await db.select().from(clients).where(eq(clients.id, input.id)).limit(1);
        
        if (!client || client.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Danışan bulunamadı',
          });
        }

        return client[0];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışan getirilirken bir hata oluştu',
        });
      }
    }),

  updateStatus: publicProcedure
    .input(z.object({ 
      id: z.number(),
      status: z.enum(['active', 'passive'])
    }))
    .mutation(async ({ input }) => {
      try {
        const updatedClient = await db.update(clients)
          .set({ status: input.status })
          .where(eq(clients.id, input.id))
          .returning();

        if (!updatedClient || updatedClient.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Danışan bulunamadı',
          });
        }

        return {
          success: true,
          client: updatedClient[0],
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışan durumu güncellenirken bir hata oluştu',
        });
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(2).optional(),
      gender: z.string().max(50).optional(),
      birth_date: z.string().optional(),
      height_cm: z.union([z.string(), z.number()]).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      notes: z.string().optional(),
      diseases: z.string().optional(), // JSON string
      allergies: z.string().optional(), // JSON string
      medications: z.string().optional(), // JSON string
      activity_level: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        
        const updatedClient = await db.update(clients)
          .set(updateData)
          .where(eq(clients.id, id))
          .returning();

        if (!updatedClient || updatedClient.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Danışan bulunamadı',
          });
        }

        return {
          success: true,
          client: updatedClient[0],
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışan bilgileri güncellenirken bir hata oluştu',
        });
      }
    }),

  getCount: publicProcedure
    .query(async () => {
      try {
        const result = await db.select({ count: sql`count(*)` }).from(clients);
        return result[0]?.count || 0;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Danışan sayısı getirilirken bir hata oluştu',
        });
      }
    }),
}); 