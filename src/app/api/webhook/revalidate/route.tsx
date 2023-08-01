import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';

enum Model {
  setting = 'setting',
  'static-text' = 'static-text',
  page = 'page',
  product = 'product',
  category = 'category',
  menu = 'menu',
  media = 'media',
  file = 'file',
}

enum Tag {
  setting = 'settings',
  'static-text' = 'static_texts',
  page = 'pages',
  product = 'products',
  category = 'categories',
  menu = 'menus',
  media = 'medias',
  file = 'files',
}

export const POST = async (req: NextRequest) => {
  if (req.headers.get('Authorization')) {
    const reqToken = req.headers.get('Authorization');
    const token = `Bearer ${process.env.STRAPI_WEBHOOK_TOKEN}`;
    if (reqToken === token) {
      const data = await req.json();
      const { model } = data;
      logger(model, 'revalidate tag');
      if (model in Model) {
        const tag = Tag[model as Model] as string;
        revalidateTag(tag);
        return NextResponse.json(
          { revalidated: true, now: Date.now() },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { revalidated: false, now: Date.now() },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
};

export const runtime = 'edge';
