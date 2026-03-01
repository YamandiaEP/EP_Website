import { defineCollection, z } from 'astro:content';

const szczyty = defineCollection({
  type: 'content',
  schema: z.object({
    nazwa:         z.string(),
    region:        z.string(),
    wysokosc:      z.number(),
    czas:          z.string(),
    przewyzszenie: z.string(),
    trudnosc:      z.enum(['łatwa', 'średnia', 'trudna']),
    done:          z.boolean().default(false),
    data:          z.string().optional(),
    photo:         z.string().optional(),
    photos:        z.array(z.string()).optional(),
    instagram:     z.string().optional(),
    tiktok:        z.string().optional(),
    gpx:           z.string().optional(),
    parking:       z.string().optional(),
    trasa:         z.string().optional(),
    kolejnosc:     z.number(),  // pozycja w KGP od najniższego
  }),
});

export const collections = { szczyty };
