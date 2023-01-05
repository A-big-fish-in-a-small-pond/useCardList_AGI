#!/usr/bin/env python
import os
import sys
import time
import datetime 
import subprocess
from asterisk.agi import *

agi = AGI()
CallerInfo=sys.argv[1]
NumberInfo=sys.argv[2]
UniqueId=sys.argv[3]
TryCount=sys.argv[4]

#CallerInfo="1"
#NumberInfo="2"
#UniqueId="3"
#TryCount="4"

filename=CallerInfo+NumberInfo+UniqueId+TryCount
file_cmd="/root/FailCall/"+filename+".fail"

f=open(file_cmd, 'w')
Data="Channel: sip/"+CallerInfo+"\n"+"CallerID: "+NumberInfo+"\n"+"MaxRetries: 0"+"\n"+"RetryTime: 40"+"\n"+"WaitTime: 35"+"\n"+"Context: DID_sst"+"\n"+"Extension:"+NumberInfo+"\n"+"Priority: "+TryCount+"\n"+"SetVar: Caller_org="+CallerInfo+"\n"
f.write(Data)
f.close()

current_time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
Add_seconds=datetime.datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S") + datetime.timedelta(seconds=4)

reservation_time=str(Add_seconds)

os.system("touch -d '"+reservation_time+ "' "+file_cmd)
os.system("mv "+file_cmd+" /var/spool/asterisk/outgoing")
