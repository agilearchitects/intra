for ARGUMENT in $@
do
  KEY=$(echo $ARGUMENT | cut -f1 -d=)
  VALUE=$(echo $ARGUMENT | cut -f2 -d=)
  case "$KEY" in
    HOST) HOST=${VALUE} ;;
    APPLICATION) APPLICATION=${VALUE} ;;
    ENV) ENV=${VALUE} ;;
    DOMAIN) DOMAIN=${VALUE} ;;
    *)
  esac
done

if [ "$HOST" != "" ] && [ "$APPLICATION" != "" ] && [ "$ENV" != "" ] && [ "$DOMAIN" != "" ]
then
  # Backup database
  ssh deploy@"$HOST" 'bash -s' < deploy/export_db.sh "$APPLICATION" "$ENV"
  # Stop application
  ssh deploy@"$HOST" \~/.nvm/versions/node/v12.8.1/bin/node \~/.nvm/versions/node/v12.8.1/bin/ssme disable api."$DOMAIN"
  # Rsync files
  rsync -i -azr --progress build node_modules storage deploy@"$HOST":~/applications/"$APPLICATION"/"$ENV" --exclude="storage/db.sqlite" --exclude="storage/uploads" --exclude="storage/migrations/*.ts"
  # Run migrations
  ssh deploy@"$HOST" \~/.nvm/versions/node/v12.8.1/bin/node \~/applications/"$APPLICATION"/"$ENV"/build/api/cli.js migrate up
  # Start application
  ssh deploy@"$HOST" \~/.nvm/versions/node/v12.8.1/bin/node \~/.nvm/versions/node/v12.8.1/bin/ssme enable api."$DOMAIN"
else
  echo "Missing argument HOST, APPLICATION, ENV or DOMAIN"
fi
