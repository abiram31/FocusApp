from winreg import *
from flask import Flask, request, jsonify
from threading import Timer

app = Flask(__name__)
keyVal = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"

def start(lst):
   for i in lst:
      regkey = keyVal+"\\"+i
      try:
         key = OpenKey(HKEY_LOCAL_MACHINE, regkey, 0, KEY_ALL_ACCESS)
      except:
         key = CreateKey(HKEY_LOCAL_MACHINE, regkey)
      SetValueEx(key, "Debugger", 0, REG_SZ, "ntsd -c q")
      print(regkey)

def end(lst):
   for i in lst:
      regkey = keyVal+"\\"+i
      try:
         key = OpenKey(HKEY_LOCAL_MACHINE, regkey, 0, KEY_ALL_ACCESS)
         DeleteValue(key, "Debugger") 
      except:
         pass
      print(regkey)

@app.route('/shutoff', methods = ['POST'])
def shutoff():
   data = request.json # a multidict containing POST data
   start(data["executables"])
   t = Timer(data['time'], end, args = (data["executables"],))
   t.start()
   return jsonify(data)


@app.route('/restart', methods = ['POST'])
def restart():
   data = request.json # a multidict containing POST data
   end(data["executables"])
   return jsonify(data)
