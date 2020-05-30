import sender
import json
import sys

try:
    with open("config.json") as file:
        config_json = json.load(file)
except IOError:
    print("Config not created")
    sender.config()

dev = False

if len(sys.argv) > 2 and sys.argv[2] == "dev":
    dev = True

sender.interact(0, dev, True, sys.argv[1])