######### Base ##################################################################
FROM node:14.17.0 as base

# Set working directory
WORKDIR /code

# Copy package.json AND package-lock.json
COPY package*.json ./

######### Prepare #################################################################
FROM base as prepare

COPY src src

######### Pre-Production ########################################################
FROM base as preprod

RUN npm install --only=production

######### Production ############################################################
FROM base as prod

# Copy app bundle
COPY --from=prepare /code/src src

# Install app dependencies
COPY --from=preprod /code/node_modules node_modules

# Set NODE_ENV to production gaining performance boost on Express
ENV NODE_ENV=production

# Start app
CMD [ "npm", "start" ]
