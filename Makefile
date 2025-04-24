.PHONY: help build push

REGISTRY ?= localhost:5000
VERSION ?= latest
UID:=$(shell id --user)
GID:=$(shell id --group)

dc = docker compose

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build:
	$(dc) build

push: build
	$(dc) push