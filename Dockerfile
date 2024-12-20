#################################################
##                   NODE                       #
#################################################
FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN npm i -g pnpm --force
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app
RUN npm i -g pnpm
COPY --from=base /app/node_modules ./node_modules
COPY tsconfig.base.json tsconfig.json .eslintrc.json ./
COPY ./libs ./libs
COPY ./apps/public/ ./apps/public/
COPY ./apps/admin/ ./apps/admin/
RUN pnpm install
RUN export NODE_OPTIONS="--max-old-space-size=(8 * 1024)"
ENV GENERATE_SOURCEMAP=false
RUN pnpm build

################################################
#                   NGINX                      #
################################################
FROM nginx:stable-alpine AS admin_signalen

COPY --from=build /app/apps/admin/dist /usr/share/nginx/html

CMD exec nginx -g 'daemon off;'
EXPOSE 3000

#
#FROM mitchpash/pnpm AS deps
#RUN apk add --no-cache libc6-compat
#WORKDIR /home/node/app
#COPY pnpm-lock.yaml .npmr[c] ./
#
#RUN pnpm fetch

#FROM mitchpash/pnpm AS builder
#WORKDIR /home/node/app
#COPY --from=deps /home/node/app/node_modules ./node_modules
#COPY . .
#
#RUN pnpm install -r --offline
#
#RUN pnpm -F=public build
#
#FROM mitchpash/pnpm AS runner
#WORKDIR /home/node/app
#
#ENV NODE_ENV production
#
#COPY --from=builder /home/node/app/next.config.js ./
#COPY --from=builder /home/node/app/public ./public
#COPY --from=builder /home/node/app/package.json ./package.json
#
## Automatically leverage output traces to reduce image size
## https://nextjs.org/docs/advanced-features/output-file-tracing
## Some things are not allowed (see https://github.com/vercel/next.js/issues/38119#issuecomment-1172099259)
#COPY --from=builder --chown=node:node /home/node/app/.next/standalone ./
#COPY --from=builder --chown=node:node /home/node/app/.next/static ./.next/static
#
#EXPOSE 3000
#
#ENV PORT 3000
#
#CMD ["node", "server.js"]


# syntax=docker.io/docker/dockerfile:1

#FROM node:20-alpine AS base
#
## Install dependencies only when needed
#FROM base AS deps
## Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
#WORKDIR /app
#
#RUN npm i -g pnpm
#
## Install dependencies based on the preferred package manager
#COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
#RUN \
#  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#  elif [ -f package-lock.json ]; then npm ci; \
#  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
#  else echo "Lockfile not found." && exit 1; \
#  fi
#
#
## Rebuild the source code only when needed
#FROM base AS builder
#WORKDIR /app
#COPY --from=deps /app/node_modules ./node_modules
#COPY . .
#
## Next.js collects completely anonymous telemetry data about general usage.
## Learn more here: https://nextjs.org/telemetry
## Uncomment the following line in case you want to disable telemetry during the build.
## ENV NEXT_TELEMETRY_DISABLED=1
#
#RUN npm i -g pnpm
#
#RUN \
#  if [ -f yarn.lock ]; then yarn run build; \
#  elif [ -f package-lock.json ]; then npm run build; \
#  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm -F=public build; \
#  else echo "Lockfile not found." && exit 1; \
#  fi
#
## Production image, copy all the files and run next
#FROM base AS runner
#WORKDIR /app
#
#ENV NODE_ENV=production
## Uncomment the following line in case you want to disable telemetry during runtime.
## ENV NEXT_TELEMETRY_DISABLED=1
#
#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs
#
#COPY --from=builder /app/public ./public
#
## Automatically leverage output traces to reduce image size
## https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#
#USER nextjs
#
#EXPOSE 3000
#
#ENV PORT=3000
#
## server.js is created by next build from the standalone output
## https://nextjs.org/docs/pages/api-reference/next-config-js/output
#ENV HOSTNAME="0.0.0.0"
#CMD ["node", "server.js"]
