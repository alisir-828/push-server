#!/bin/bash

APP_NAME="push-server-app"
LOG_DIR="./logs"
OUT_LOG="$LOG_DIR/push-server-app-out.log"
ERROR_LOG="$LOG_DIR/push-server-app-error.log"

mkdir -p $LOG_DIR

case "$1" in
  start)
    pm2 start dist/index.js --name $APP_NAME --output $OUT_LOG --error $ERROR_LOG --merge-logs --log-date-format "YYYY-MM-DD HH:mm Z"
    ;;
  stop)
    pm2 stop $APP_NAME
    ;;
  restart)
    pm2 restart $APP_NAME
    ;;
  delete)
    pm2 delete $APP_NAME
    ;;
  status)
    pm2 status $APP_NAME
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|delete|status}"
    ;;
esac