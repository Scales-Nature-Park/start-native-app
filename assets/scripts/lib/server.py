import os
import sys
import subprocess
import time
import requests

# This script aims to to keep the START Data App server running at all times
# It performs a get request to localhost port 5000 and if the server is still running then it prints a success
# message, otherwise it launches the RunServer.bat script that installs dependancies
# if theyre not installed and runs the server.

url = 'http://localhost:5000'

# get path of script and remove the file name from it
filePath = os.path.realpath(__file__)
if ('\server.py' in filePath):
    filePath.replace('\server.py', '')

# check if the executing script is an exe, if so get the actual path of the
# executable file
if getattr(sys, 'frozen', False):
    filePath = os.path.dirname(sys.executable)

batchScript = os.path.join(filePath, '..', '..', 'RunServer.bat')
while (1):
    # try running a get request and it responds with a code, then server 
    # is running, otherwise it will give an exception
    try:
        request = requests.get(url)
        print('Server is running...', end="\r")
    except Exception as err:
        # Exception means server is down, attempt to releanch it
        print('Server not running. Launching server...')
        subprocess.Popen([batchScript])

    # Wait 5 seconds till the next check
    time.sleep(5)         
