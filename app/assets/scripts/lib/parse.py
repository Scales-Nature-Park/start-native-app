import sys 

def isID(string):
    list = string.split()
    print (list)
    
    # quick way of checking for the directory we're looking for without regex
    # if previous versions exist it should just return the most recent one
    if len(list) > 1 and "start-data-app".casefold() == list[1].casefold():
        return 1

    return 0

def isURL(string):
    list = string.split()

    if "viewurl:" in list[0].lower():
        return 1
    return 0
    

try: 
    # open file written by batch script and parse it for required string
    id = 1
    file = open("tempFile.txt", "r+")
    
    # indicates were looking for url not id
    if len(sys.argv) == 2 and sys.argv[1].lower() == "url":
        id = 0
    
    currLine = file.readline()

    while currLine: 
        if id and isID(currLine):
            # write id of patch folder 
            file = open("tempFile.txt", "w")
            file.write(currLine.split()[0])
            break
        elif not id and isURL(currLine):
            # write view url of the patch folder
            file = open("tempFile.txt", "w")
            file.write(currLine.split()[1])
            break
        currLine = file.readline() 

except Exception as err:
    # in the case this ever happens, batch script fails to share link of
    # the already uploaded folder. 
    print(err)
    exit(-1)

file.close()