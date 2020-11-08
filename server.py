from winreg import *
from flask import Flask, request, jsonify

app = Flask(__name__)
keyVal = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"

@app.route('/shutoff', methods = ['POST'])
def shutoff():
   data = request.json # a multidict containing POST data
   for i in data["executables"]:
      regkey = keyVal+"\\"+i
      try:
         key = OpenKey(HKEY_LOCAL_MACHINE, regkey, 0, KEY_ALL_ACCESS)
      except:
         key = CreateKey(HKEY_LOCAL_MACHINE, regkey)
      SetValueEx(key, "Debugger", 0, REG_SZ, "ntsd -c q")
      print(regkey)

   return jsonify(data)


@app.route('/restart', methods = ['POST'])
def restart():
   data = request.json # a multidict containing POST data
   for i in data["executables"]:
      regkey = keyVal+"\\"+i
      try:
         key = OpenKey(HKEY_LOCAL_MACHINE, regkey, 0, KEY_ALL_ACCESS)
      except:
         key = CreateKey(HKEY_LOCAL_MACHINE, regkey)
      DeleteValue(key, "Debugger") 
      print(regkey)

   return jsonify(data)
