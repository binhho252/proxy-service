#!/bin/bash

URLS=(
  "https://www.youtube.com/watch?v=abc123"
  "https://www.youtube.com/watch?v=xyz456"
  # Add 1000 URLs here
)

for url in "${URLS[@]}"; do
  curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/proxy/video-info?url=$url" &
done
wait
