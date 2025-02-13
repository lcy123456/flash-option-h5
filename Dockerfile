FROM nginx:1.17.6

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -rf /usr/share/nginx/html \
    && sed -i "/location \/ {/a \
                try_files \$uri \$uri\/ \/index.html; \
    " /etc/nginx/conf.d/default.conf

ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]