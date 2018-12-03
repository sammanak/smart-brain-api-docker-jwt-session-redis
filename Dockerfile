FROM node:10.10.0

# USER node

WORKDIR /usr/src/smart-brain-api

# COPY server.js ./
COPY ./ ./

# EXPOSE 3001

# RUN set COMPOSE_CONVERT_WINDOWS_PATHS=1
RUN npm install

CMD ["/bin/bash"]