FROM node:18-alpine AS base
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn install --network-timeout 600000


# # Install dependencies only when needed
# FROM base AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk update && apk add --no-cache libc6-compat
# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* ./
# RUN yarn install --network-timeout 600000


# # Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules

# COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

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

ENV NODE_ENV production

# Run the script to add/update environment variables in .env.production.local
RUN apk add --no-cache --upgrade bash
# RUN chmod +x ./add_env_vars.sh
# RUN ./add_env_vars.sh

RUN yarn build
EXPOSE 3000


# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/cache ./.next/cache

COPY --from=base /app/.env ./.env.production.local

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost

CMD ["yarn", "start"]