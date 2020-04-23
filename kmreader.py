import obd

import time

from timeloop import Timeloop
from datetime import timedelta

connection = obd.OBD("\\.\\COM3")
status = connection.status()
print(status)

distance = 0

tl=Timeloop()

@tl.job(interval=timedelta(seconds=1))
def readSPEED():
    speed = connection.query(obd.commands.SPEED)
    meters = speed.value.magnitude/3.6
    global distance
    distance = distance+meters

@tl.job(interval=timedelta(seconds=10))
def printDistance():
    print(distance)



tl.start(block=True)




