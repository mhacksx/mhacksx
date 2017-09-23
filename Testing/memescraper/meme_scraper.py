import os, requests, bs4, time, urllib

while True:
	imageFolder = ''
	urlList = []
	unique = False # Flag to see if new url has been added
	scriptPath = os.path.dirname(__file__)
	urlFileName = os.path.join(scriptPath, 'url_file.txt')
	urlFileList = open(urlFileName, 'r+')
	numIterations = int(input('How many pages of memes do you want (max 5)? '))
	if numIterations > 5 or numIterations < 1:
		print('Please enter a number between 1 and 5 inclusive.')
		continue
	else:
		break
if os.path.getsize(urlFileName) > 0:
	urlList = [x.strip() for x in urlFileList.readlines()]
url = 'https://www.reddit.com/r/memes'
if os.path.isdir(os.path.join(scriptPath, 'Images')):
	imageFolder = os.path.join(scriptPath, 'Images')
else:
	imageFolder = str(os.makedirs(os.path.join(scriptPath, 'Images'))) # Creates folder to save images in.
os.chdir(imageFolder)

for h in range(numIterations):
	res = requests.get(url)
	res.raise_for_status()
	soup = bs4.BeautifulSoup(res.text, 'html.parser')
	tableElems = soup.select('#siteTable > div')
	for i in range(len(tableElems)):
		if len(tableElems[i].attrs) == 1 or tableElems[i].attrs['data-url'] in urlList:
			continue
		unique = True
		imageURL = tableElems[i].attrs['data-url']
		urlList.append('\n'+imageURL)
		imageRes = requests.get(imageURL)
		imageFile = open(os.path.join(os.getcwd(), os.path.basename(imageURL)), 'wb')
		print('Currently Downloading {}...'.format(os.path.basename(imageURL)))
		for chunk in imageRes.iter_content(100000):
			imageFile.write(chunk)
	nextButton = soup.select('.next-button > a')
	url = nextButton[0].attrs['href']

if unique:
	urlFileList2 = open(urlFileName, 'w+')
	for url in urlList:
		urlFileList.write(url)
	urlFileList2.close()
urlFileList.close()


		
    
