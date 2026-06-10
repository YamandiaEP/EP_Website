import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const szczyty = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/szczyty' }),
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
    kolejnosc:     z.number(),
  }),
});

const trasy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trasy' }),
  schema: z.object({
    nazwa:         z.string(),
    start:         z.string(),
    meta:          z.string(),
    region:        z.string(),
    dystans:       z.string(),
    dni:           z.string(),
    przewyzszenie: z.string(),
    nawierzchnia:  z.string(),                       // np. "Asfalt / ścieżki"
    trudnosc:      z.enum(['łatwa', 'średnia', 'trudna']),
    done:          z.boolean().default(false),
    data:          z.string().optional(),
    photo:         z.string().optional(),
    photos:        z.array(z.string()).optional(),
    instagram:     z.string().optional(),
    tiktok:        z.string().optional(),
    gpx:           z.string().optional(),
    mapa:          z.string().optional(),            // link mapy.com
    kolejnosc:     z.number(),
  }),
});

export const collections = { szczyty, trasy };
