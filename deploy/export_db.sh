declare APP=$1
declare ENV=$2

if test -f "$HOME/applications/$APP/$ENV/storage/db.sqlite"; then
	declare CURRENTDATE=`date +"%Y-%m-%d %T"`
	declare -a MYARRAY=()
	while IFS= read -r line; do
		MYARRAY+=("$line")
	done < <( sqlite3 ~/applications/$APP/$ENV/storage/db.sqlite "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';" )
	mkdir "$HOME/backups/databases/$APP.$ENV/$CURRENTDATE" -p
	cp "$HOME/applications/$APP/$ENV/storage/db.sqlite" "$HOME/backups/databases/$APP.$ENV/$CURRENTDATE/db.sqlite"
	for i in "${MYARRAY[@]}"
	do
		sqlite3 -header -csv "$HOME/applications/$APP/$ENV/storage/db.sqlite" "select * from $i;" > "$HOME/backups/databases/$APP.$ENV/$CURRENTDATE/$i.csv"
	done
else
	echo "$HOME/applications/$APP/$ENV/storage/db.sqlite doesn't exists"
fi
