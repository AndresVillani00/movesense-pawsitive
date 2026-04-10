FROM mcr.microsoft.com/devcontainers/python:1-3.10-bookworm

ENV PYTHONUNBUFFERED 1

# 1. Eliminar el repositorio roto de Yarn que Microsoft deja por defecto
RUN rm -f /etc/apt/sources.list.d/yarn.list

# 2. Actualizar e instalar PostgreSQL de forma segura
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client

