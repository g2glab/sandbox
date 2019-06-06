./node_modules/forever/bin/forever stop server.js
<<<<<<< HEAD
./node_modules/forever/bin/forever start -o server.log server.js /var/www/html http://localhost 8080
=======
./node_modules/forever/bin/forever start -o server.log server.js /var/www/html http://g2g.fun 8080
>>>>>>> 24bf972b40241f49190f58aa4d27ef60fcdc4318
sleep 1
echo -e "\n\n# Ctrl+C to quit. This server will be still running.\n\n"
tail -f server.log
