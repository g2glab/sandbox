#!/bin/bash

# This script controls the behaviour of the g2glab Sandbox.
# It can be used as a standalone script or in combination with npm.
# Available commands are:
# -start
# -stop
# -restart
# -status
# -log (works just like the 'tail' command)

start()
{
    if [ $(status) = "running" ]; then
        echo "already running"
        return 1
    fi

    node ./src/server.js 2>&1 | tee server.log &
    jobs -p > proc_id                           # save the process ID
    disown                                      # and move to seperate process group
    echo "Sandbox started"
}

stop()
{
    PROC_ID=$(cat proc_id 2> /dev/null)
    if [ $? = 0 ]; then                         # check if proc_id file exists, means Sandbox running 
        echo "Stopping sandbox"
        kill $PROC_ID && rm proc_id && echo "Sandbox stopped"
                                                # if so remove proc_id file
    else 
        echo "Sandbox currently not running"
    fi
}

status()
{
    PROC_ID=$(cat proc_id 2> /dev/null)
    if [ $? != 0 ]; then                        # check if proc_id file exists
        echo "stopped"
    elif ps -q $PROC_ID > /dev/null; then       # if so, check if process is running
        echo "running"
    else                                        # if not so, something went wrong
        echo "dead"
    fi
}

ctrl_c() {
    echo
    stop
    rm -f proc_id                               # remove silently 
    exit 0
}

trap ctrl_c INT                                 # catch interrupt for graceful shutdown

# Start server 
if [ "$1" = "start" ]; then
    start

    while :                                     # make server run forever until actively being stopped
    do
        case $(status) in                       
            running)
                sleep .5
                ;;
            dead)
                start
                ;;
            stopped)
                echo "Sandbox stopped"          # stopped externally
                exit 0
                ;;
        esac
    done
fi

# Stop server
if [ "$1" = "stop" ]; then
    stop
fi

# Restart server
if [ "$1" = "restart" ]; then
    stop
    start
fi


# View logs
if [ "$1" = "log" ]; then
    tail "${@:2}" server.log
fi

# Check status of server
if [ "$1" = "status" ]; then
    echo "The server is $(status)"
fi

