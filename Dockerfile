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
RUN pnpm build

################################################
#                   NGINX                      #
################################################
FROM nginx:stable-alpine AS admin_signalen

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build /app/apps/admin/dist ./

CMD exec nginx -g 'daemon off;'
EXPOSE 3001


################################################
#                   NODE                       #
################################################
FROM base AS public_signalen
WORKDIR /app
RUN npm i -g next

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

USER nextjs

COPY --from=build --chown=nextjs:nodejs /app/apps/public/next.config.ts ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/apps/public/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/public/.next/static ./apps/public/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/public/public ./apps/public/public

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/public/server.js"]
