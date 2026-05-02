#!/usr/bin/env bash

set -euo pipefail

since="${1:-1h}"

netlify logs \
  --source edge-functions \
  --edge-function block-abusive-bots \
  --json \
  --since "$since" |
  jq -r '
    def message:
      .message // .msg // .text // .line // "";

    message
    | capture("(?<payload>\\{.*\\})")?
    | .payload
    | fromjson?
    | select(.event == "blocked-request")
    | [.reason, .country, .ip, .agentCategory, .path, .userAgent]
    | @tsv
  ' |
  awk -F "\t" '
    {
      reason[$1]++
      country[$2]++
      ip[$3]++
      path[$5]++
      ua[$6]++
    }
    END {
      print "Blocked requests by reason:"
      for (item in reason) print reason[item], item
      print ""
      print "Blocked requests by country:"
      for (item in country) if (item != "") print country[item], item
      print ""
      print "Blocked requests by IP:"
      for (item in ip) if (item != "") print ip[item], item
      print ""
      print "Blocked requests by path:"
      for (item in path) print path[item], item
      print ""
      print "Blocked requests by user agent:"
      for (item in ua) if (item != "") print ua[item], item
    }
  '
