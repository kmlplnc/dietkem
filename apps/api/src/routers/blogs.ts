import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '@dietkem/db';
import { blogs } from '@dietkem/db/schema';
import { eq, desc, and } from 'drizzle-orm';

// Blog post tipi
const BlogPost = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  category: z.string(),
  author: z.string(),
  date: z.string(),
  image: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'published']),
  content: z.string()
});

type BlogPost = z.infer<typeof BlogPost>;

export const blogsRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const allBlogs = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          summary: blogs.summary,
          content: blogs.content,
          category: blogs.category,
          author: blogs.author,
          image: blogs.image,
          status: blogs.status,
          created_at: blogs.created_at,
          published_at: blogs.published_at,
          view_count: blogs.view_count,
          is_featured: blogs.is_featured,
          slug: blogs.slug,
        })
        .from(blogs)
        .where(eq(blogs.status, 'published'))
        .orderBy(desc(blogs.published_at));

      return allBlogs.map(blog => ({
        id: blog.id.toString(),
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        category: blog.category,
        author: blog.author,
        image: blog.image,
        status: blog.status,
        date: blog.published_at?.toISOString().split('T')[0] || blog.created_at.toISOString().split('T')[0],
        view_count: blog.view_count,
        is_featured: blog.is_featured,
        slug: blog.slug,
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw new Error('Failed to fetch blogs');
    }
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      try {
        const blog = await db
          .select({
            id: blogs.id,
            title: blogs.title,
            summary: blogs.summary,
            content: blogs.content,
            category: blogs.category,
            author: blogs.author,
            image: blogs.image,
            status: blogs.status,
            created_at: blogs.created_at,
            published_at: blogs.published_at,
            view_count: blogs.view_count,
            is_featured: blogs.is_featured,
            slug: blogs.slug,
            meta_title: blogs.meta_title,
            meta_description: blogs.meta_description,
          })
          .from(blogs)
          .where(eq(blogs.id, parseInt(id)))
          .limit(1);

        if (!blog.length) {
          throw new Error('Blog post not found');
        }

        const blogData = blog[0];
        return {
          id: blogData.id.toString(),
          title: blogData.title,
          summary: blogData.summary,
          content: blogData.content,
          category: blogData.category,
          author: blogData.author,
          image: blogData.image,
          status: blogData.status,
          date: blogData.published_at?.toISOString().split('T')[0] || blogData.created_at.toISOString().split('T')[0],
          view_count: blogData.view_count,
          is_featured: blogData.is_featured,
          slug: blogData.slug,
          meta_title: blogData.meta_title,
          meta_description: blogData.meta_description,
        };
      } catch (error) {
        console.error('Error fetching blog by id:', error);
        throw new Error('Blog post not found');
      }
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input: slug }) => {
      try {
        const blog = await db
          .select({
            id: blogs.id,
            title: blogs.title,
            summary: blogs.summary,
            content: blogs.content,
            category: blogs.category,
            author: blogs.author,
            image: blogs.image,
            status: blogs.status,
            created_at: blogs.created_at,
            published_at: blogs.published_at,
            view_count: blogs.view_count,
            is_featured: blogs.is_featured,
            slug: blogs.slug,
            meta_title: blogs.meta_title,
            meta_description: blogs.meta_description,
          })
          .from(blogs)
          .where(eq(blogs.slug, slug))
          .limit(1);

        if (!blog.length) {
          throw new Error('Blog post not found');
        }

        const blogData = blog[0];
        return {
          id: blogData.id.toString(),
          title: blogData.title,
          summary: blogData.summary,
          content: blogData.content,
          category: blogData.category,
          author: blogData.author,
          image: blogData.image,
          status: blogData.status,
          date: blogData.published_at?.toISOString().split('T')[0] || blogData.created_at.toISOString().split('T')[0],
          view_count: blogData.view_count,
          is_featured: blogData.is_featured,
          slug: blogData.slug,
          meta_title: blogData.meta_title,
          meta_description: blogData.meta_description,
        };
      } catch (error) {
        console.error('Error fetching blog by slug:', error);
        throw new Error('Blog post not found');
      }
    }),

  getPending: publicProcedure.query(async () => {
    try {
      const pendingBlogs = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          summary: blogs.summary,
          content: blogs.content,
          category: blogs.category,
          author: blogs.author,
          image: blogs.image,
          status: blogs.status,
          created_at: blogs.created_at,
          published_at: blogs.published_at,
          view_count: blogs.view_count,
          is_featured: blogs.is_featured,
          slug: blogs.slug,
        })
        .from(blogs)
        .where(eq(blogs.status, 'pending'))
        .orderBy(desc(blogs.created_at));

      return pendingBlogs.map(blog => ({
        id: blog.id.toString(),
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        category: blog.category,
        author: blog.author,
        image: blog.image,
        status: blog.status,
        date: blog.published_at?.toISOString().split('T')[0] || blog.created_at.toISOString().split('T')[0],
        view_count: blog.view_count,
        is_featured: blog.is_featured,
        slug: blog.slug,
      }));
    } catch (error) {
      console.error('Error fetching pending blogs:', error);
      throw new Error('Failed to fetch pending blogs');
    }
  }),

  update: publicProcedure
    .input(BlogPost)
    .mutation(async ({ input }) => {
      try {
        const updatedBlog = await db
          .update(blogs)
          .set({
            title: input.title,
            summary: input.summary,
            content: input.content,
            category: input.category,
            author: input.author,
            image: input.image,
            status: input.status,
            updated_at: new Date(),
          })
          .where(eq(blogs.id, parseInt(input.id)))
          .returning();

        if (!updatedBlog.length) {
          throw new Error('Blog post not found');
        }

        return { success: true, blog: updatedBlog[0] };
      } catch (error) {
        console.error('Error updating blog:', error);
        throw new Error('Failed to update blog');
      }
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const deletedBlog = await db
          .delete(blogs)
          .where(eq(blogs.id, parseInt(id)))
          .returning();

        if (!deletedBlog.length) {
          throw new Error('Blog post not found');
        }

        return { success: true };
      } catch (error) {
        console.error('Error deleting blog:', error);
        throw new Error('Failed to delete blog');
      }
    }),

  approve: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const updatedBlog = await db
          .update(blogs)
          .set({
            status: 'published',
            published_at: new Date(),
            updated_at: new Date(),
          })
          .where(eq(blogs.id, parseInt(id)))
          .returning();

        if (!updatedBlog.length) {
          throw new Error('Blog post not found');
        }

        return { success: true };
      } catch (error) {
        console.error('Error approving blog:', error);
        throw new Error('Failed to approve blog');
      }
    }),

  reject: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      try {
        const updatedBlog = await db
          .update(blogs)
          .set({
            status: 'rejected',
            updated_at: new Date(),
          })
          .where(eq(blogs.id, parseInt(id)))
          .returning();

        if (!updatedBlog.length) {
          throw new Error('Blog post not found');
        }

        return { success: true };
      } catch (error) {
        console.error('Error rejecting blog:', error);
        throw new Error('Failed to reject blog');
      }
    }),

  create: publicProcedure
    .input(BlogPost.omit({ id: true, status: true }))
    .mutation(async ({ input }) => {
      try {
        const newBlog = await db
          .insert(blogs)
          .values({
            title: input.title,
            summary: input.summary,
            content: input.content,
            category: input.category,
            author: input.author,
            image: input.image,
            status: 'pending',
            slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        return {
          id: newBlog[0].id.toString(),
          title: newBlog[0].title,
          summary: newBlog[0].summary,
          content: newBlog[0].content,
          category: newBlog[0].category,
          author: newBlog[0].author,
          image: newBlog[0].image,
          status: newBlog[0].status,
          slug: newBlog[0].slug,
        };
      } catch (error) {
        console.error('Error creating blog:', error);
        throw new Error('Failed to create blog');
      }
    }),
}); 