# fileHandle = 'adjektiv'
fileHandle = 'substantiv'
ordList = []
import json

with open(fileHandle + '.txt', encoding="utf-8") as txtFile:
  # file = f.readline();
  i = 1
  for line in txtFile:
    if (i % 2):
      # print(line)
      ordList.append(line.strip())
    i += 1


ordList.sort()

with open(fileHandle + '.json', 'w', encoding="utf-8") as jsonFile:
  # json.dumps(ordList, 'indent:2', jsonFile)
  json.dump(ordList, jsonFile, ensure_ascii=False)
