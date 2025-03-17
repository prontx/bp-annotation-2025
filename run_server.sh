#!/bin/bash
PORT=8000

source ./venv/bin/activate
daphne collab_writing.asgi:application --port ${PORT} --verbosity 2

