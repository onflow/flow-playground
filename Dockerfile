# Build out the static site:
FROM node:12.16-alpine AS builder

RUN mkdir -p /app
WORKDIR  /app

# install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

ARG TARGET
ARG FIREBASE_API_KEY
ARG GRAPHQL_API
ARG MIXPANEL_TOKEN
ARG AVATAAR_URL
ARG DEFAULT_SEO_IMAGE
ARG GA_TRACKING_CODE

ENV FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV FIREBASE_DEV_API_KEY=$FIREBASE_API_KEY
ENV GRAPHQL_API=$GRAPHQL_API
ENV MIXPANEL_TOKEN=$MIXPANEL_TOKEN
ENV AVATAAR_URL=$AVATAAR_URL
ENV DEFAULT_SEO_IMAGE=$DEFAULT_SEO_IMAGE
ENV GA_TRACKING_CODE=$GA_TRACKING_CODE

# Copy over application source to build:
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=8192 yarn run build-${TARGET}

# Should generate a /out folder that we'll use in the next step:
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
