import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

enum Model {
  setting = 'setting',
  'static-text' = 'static-text',
  page = 'page',
  product = 'product',
  category = 'category',
}

enum Tag {
  setting = 'settings',
  'static-text' = 'static_texts',
  page = 'pages',
  product = 'products',
  category = 'categories',
}

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const { model } = data;
  if (model in Model) {
    const tag = Tag[model as Model] as string;
    revalidateTag(tag);
  }
  return new NextResponse();
};

export const runtime = 'edge';

// CACHE CERTAINEMENT TOUJOUR HIT CAR LES DONNES NE SONT PAS MISES A JOUR AVEC LE REVALIDATE, certainement car j'utilise une nouvelle instance du client strapi a chaque fois
// TODO: ajouter un token autorization a verifier
