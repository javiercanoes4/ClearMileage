import obd
import time
import sender
import json
from timeloop import Timeloop
from datetime import timedelta
import os
import _thread
import sys

try:
    with open("config.json") as file:
        config_json = json.load(file)
except IOError:
    print("Config not created")
    sender.config()

connection = obd.OBD("\\.\\COM3")
status = connection.status()
print(status)

dev = False

if len(sys.argv) > 1 and sys.argv[1] == "dev":
    dev = True


distance = 0

tl=Timeloop()

@tl.job(interval=timedelta(seconds=1))
def readSPEED():
    global distance
    speed = connection.query(obd.commands.SPEED)
    try:
        meters = speed.value.magnitude/3.6
    except AttributeError as error:
        print(error)
        _thread.interrupt_main()
        sender.interact(distance,dev,False)
        exit()
    distance = distance+meters
    print(distance)

# @tl.job(interval=timedelta(seconds=10))
# def printDistance():
#     print(distance)



tl.start(block=True)




