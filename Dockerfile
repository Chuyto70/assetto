FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Development image
FROM base AS runner
WORKDIR /app

# Pass all environment variables at build time
ARG BUNDLE_ANALYZE
ARG NEXT_PUBLIC_SHOW_LOGGER
ARG NEXT_PUBLIC_DEPLOYMENT_URL
ARG NEXT_PUBLIC_DEFAULT_LOCALE
ARG NEXT_PUBLIC_STRAPI_URL
ARG STRAPI_API_TOKEN
ARG STRAPI_WEBHOOK_TOKEN
ARG IMAGES_DOMAINS
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG STRIPE_SECRET_KEY
ARG SENDGRID_API_KEY
ARG DEPLOYMENT_PORT
ARG DEPLOYMENT_HOST

ENV BUNDLE_ANALYZE ${BUNDLE_ANALYZE}
ENV NEXT_PUBLIC_SHOW_LOGGER ${NEXT_PUBLIC_SHOW_LOGGER}
ENV NEXT_PUBLIC_DEPLOYMENT_URL ${NEXT_PUBLIC_DEPLOYMENT_URL}
ENV NEXT_PUBLIC_DEFAULT_LOCALE ${NEXT_PUBLIC_DEFAULT_LOCALE}
ENV NEXT_PUBLIC_STRAPI_URL ${NEXT_PUBLIC_STRAPI_URL}
ENV STRAPI_API_TOKEN ${STRAPI_API_TOKEN}
ENV STRAPI_WEBHOOK_TOKEN ${STRAPI_WEBHOOK_TOKEN}
ENV IMAGES_DOMAINS ${IMAGES_DOMAINS}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV STRIPE_SECRET_KEY ${STRIPE_SECRET_KEY}
ENV SENDGRID_API_KEY ${SENDGRID_API_KEY}
ENV DEPLOYMENT_PORT ${DEPLOYMENT_PORT}
ENV DEPLOYMENT_HOST ${DEPLOYMENT_HOST}

ENV NODE_ENV development
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the script to add/update environment variables in .env.development.local
RUN apk add --no-cache --upgrade bash
RUN ["chmod", "+x", "./add_env_vars.development.sh"]
RUN ["./add_env_vars.development.sh"]

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["yarn", "dev"]