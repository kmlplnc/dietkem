import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

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

// Şimdilik örnek veri
let samplePosts: BlogPost[] = [
  // Eğer hiç blog kalmasın isteniyorsa, bu satırı boş bırak:
  //
  // Eğer orijinal 3 örnek blog kalacaksa, aşağıdaki gibi bırakabilirsiniz:
  // {
  //   id: '1',
  //   title: 'Yapay Zeka ile Diyet Planlaması',
  //   summary: 'Yapay zeka teknolojilerinin diyet planlamasında kullanımı ve avantajları.',
  //   category: 'AI',
  //   author: 'Dr. Mehmet Yılmaz',
  //   date: '2024-03-15',
  //   image: '/assets/blog/ai-diet.png',
  //   status: 'approved',
  //   content: 'Yapay zeka ile diyet planlaması hakkında detaylı içerik burada yer alacak.'
  // },
  // ...
];

export const blogsRouter = router({
  getAll: publicProcedure.query(() => {
    return samplePosts;
  }),

  getById: publicProcedure
    .input(z.string())
    .query(({ input: id }) => {
      const post = samplePosts.find(post => post.id === id);
      if (!post) {
        throw new Error('Blog post not found');
      }
      return post;
    }),

  getPending: publicProcedure.query(() => {
    return samplePosts.filter(post => post.status === 'pending');
  }),

  update: publicProcedure
    .input(BlogPost)
    .mutation(({ input }) => {
      const index = samplePosts.findIndex(post => post.id === input.id);
      if (index === -1) {
        throw new Error('Blog post not found');
      }
      samplePosts[index] = input;
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input: id }) => {
      const index = samplePosts.findIndex(post => post.id === id);
      if (index === -1) {
        throw new Error('Blog post not found');
      }
      samplePosts = samplePosts.filter(post => post.id !== id);
      return { success: true };
    }),

  approve: publicProcedure
    .input(z.string())
    .mutation(({ input: id }) => {
      const index = samplePosts.findIndex(post => post.id === id);
      if (index === -1) {
        throw new Error('Blog post not found');
      }
      samplePosts[index].status = 'published';
      return { success: true };
    }),

  reject: publicProcedure
    .input(z.string())
    .mutation(({ input: id }) => {
      const index = samplePosts.findIndex(post => post.id === id);
      if (index === -1) {
        throw new Error('Blog post not found');
      }
      samplePosts[index].status = 'rejected';
      return { success: true };
    }),

  create: publicProcedure
    .input(BlogPost.omit({ id: true, status: true }))
    .mutation(({ input }) => {
      const newPost = {
        ...input,
        id: crypto.randomUUID(),
        status: 'pending' as const,
      };
      samplePosts.unshift(newPost);
      return newPost;
    }),
}); 