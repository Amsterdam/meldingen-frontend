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

ENV VITE_KEYCLOAK_BASE_URL=$VITE_KEYCLOAK_BASE_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_BACKEND_BASE_UR=$VITE_BACKEND_BASE_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build


################################################
#                   ADMIN                      #
################################################
FROM nginx:stable-alpine AS admin_meldingen

WORKDIR /usr/share/nginx/html

RUN set -eux; \
    rm -rf ./*; \
    mkdir -p /var/cache/nginx; \
    chown -R nginx:nginx /var/cache/nginx; \
    touch /var/run/nginx.pid; \
    chown -R nginx:nginx /var/run/nginx.pid

COPY --from=build /app/apps/admin/dist ./
COPY ./default.conf /etc/nginx/conf.d/default.conf

USER nginx

CMD exec nginx -g 'daemon off;'
EXPOSE 3001


################################################
#                 MELDING FORM                 #
################################################
# Sourced from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM base AS melding_form_meldingen
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set the backend URL to a runtime environment variable
ARG NEXT_INTERNAL_BACKEND_BASE_URL
ENV NEXT_INTERNAL_BACKEND_BASE_URL=$NEXT_INTERNAL_BACKEND_BASE_URL

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/melding-form/public ./apps/melding-form/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/apps/melding-form/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/melding-form/.next/static ./apps/melding-form/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/melding-form/server.js"]


################################################
#                 BACK-OFFICE                  #
################################################
# Sourced from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM base AS back_office_meldingen
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set the backend URL to a runtime environment variable
ARG NEXT_INTERNAL_BACKEND_BASE_URL
ENV NEXT_INTERNAL_BACKEND_BASE_URL=$NEXT_INTERNAL_BACKEND_BASE_URL

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/back-office/public ./apps/back-office/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/apps/back-office/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/back-office/.next/static ./apps/back-office/.next/static

USER nextjs

EXPOSE 3002

ENV PORT=3002

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/back-office/server.js"]

