#################################################
##                   BASE                       #
#################################################
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app


#################################################
##                   BUILD                      #
#################################################
FROM base AS build

# Set args for the Admin application. These are inlined at build time.
ARG VITE_KEYCLOAK_BASE_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_BACKEND_BASE_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build


################################################
#                   ADMIN                      #
################################################
FROM nginx:stable-alpine AS admin_meldingen

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build /app/apps/admin/dist ./

CMD exec nginx -g 'daemon off;'
EXPOSE 3001


################################################
#                   PUBLIC                     #
################################################
# Sourced from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM base AS public_meldingen
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set the backend URL to a runtime environment variable
ARG NEXT_BACKEND_BASE_URL
ENV NEXT_BACKEND_BASE_URL=$NEXT_BACKEND_BASE_URL

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/public/public ./apps/public/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/apps/public/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/public/.next/static ./apps/public/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/public/server.js"]
