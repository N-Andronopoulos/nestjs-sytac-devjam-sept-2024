FROM node:lts-alpine AS development

WORKDIR /app

COPY ../package.json .
COPY ../package-lock.json .
RUN npm ci --loglevel=error --no-update-notifier

COPY .. .
RUN npm run build

FROM node:lts-alpine AS production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

COPY --from=development /app/package.json .
COPY --from=development /app/package-lock.json .
RUN npm ci --omit=dev --loglevel=error --no-update-notifier
COPY --from=development /app/dist ./dist

EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/src/main.js"]
