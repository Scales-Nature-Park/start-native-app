from asyncio.windows_events import NULL
import os
import sys
import psutil
import subprocess
import time

# This script aims to to keep the START Data App server running at all times
# It checks the server.txt file and reads the pid written to it by the last instance 
# of a running server. If the process is still running then it prints a success
# message, otherwise it launches the RunServer.bat script that installs dependancies
# if theyre not installed and runs the server.

# get path of script and remove the file name from it
filePath = os.path.realpath(__file__)
if ('\server.py' in filePath):
    filePath.replace('\server.py', '')

# check if the executing script is an exe, if so get the actual path of the
# executable file
if getattr(sys, 'frozen', False):
    filePath = os.path.dirname(sys.executable)

batchPath = os.path.join(filePath, '..', '..')
while (1):
    try:
        pid = -1
        file = NULL
        
        # try to open the file and read the pid of the process
        try: 
            file = open(os.path.join(batchPath, 'server.txt'), 'r+')
            pid  = int(file.readline())
        except Exception as err1:
            pass
        
        # check if the running processes include a node instance with the read pid
        # if not run the batchScript
        if not any(x.name() == 'node.exe' and x.pid == pid for x in psutil.process_iter()):
            print('Server not running. Launching server...')
            batchScript = os.path.join(batchPath, 'RunServer.bat')
            subprocess.Popen([batchScript])
        else:
            print('Server is running...', end="\r")
        
        # close file
        if (file):
            file.close()
    except Exception as err:
        print(err)
        pass

    # Wait 5 seconds till the next check
    time.sleep(5)         
