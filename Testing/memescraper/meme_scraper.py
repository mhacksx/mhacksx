from PIL import Image
import os, requests, bs4, time, sys

while True:
	imageFolder = ''
	urlList = []
	scriptPath = os.path.dirname(__file__)
	urlFileName = ''
	if os.path.isfile(os.path.join(scriptPath, 'url_file.txt')):
		urlFileName = os.path.join(scriptPath, 'url_file.txt')
		urlFileList = open('url_file.txt', 'r+')
		urlFileList2 = open('url_file.txt', 'a+')
	else:
		urlFileList = open('url_file.txt', 'w+')
		urlFileName = os.path.join(scriptPath, 'url_file.txt')
		urlFileList2 = open(urlFileName, 'a+')
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
os.chdir(os.path.join(scriptPath, 'Images'))

for h in range(numIterations):
	try:
		res = requests.get(url)
		res.raise_for_status()
	except requests.exceptions.HTTPError as err:
		print("You've tried to access this content too many times. Please try again in a bit.")
		break
	soup = bs4.BeautifulSoup(res.text, 'html.parser')
	tableElems = soup.select('#siteTable > div')
	for i in range(len(tableElems)):
		if len(tableElems[i].attrs) == 1 or tableElems[i].attrs['data-url'] in urlList:
			continue
		imageURL = tableElems[i].attrs['data-url']
		url = '\n' + imageURL
		urlList.append(url)
		urlFileList2.write(url)
		imageRes = requests.get(imageURL)
		imageFile = open(os.path.join(os.getcwd(), os.path.basename(imageURL)), 'wb')
		print('Currently Downloading {}...'.format(os.path.basename(imageURL)))
		for chunk in imageRes.iter_content(100000):
			imageFile.write(chunk)
		im = Image.open(os.path.join(os.getcwd(), os.path.basename(imageURL)))
		if im.mode == 'RGB':
			im.save(os.path.join(os.getcwd(), os.path.basename(imageURL)).replace('.jpg','.png'))
			os.remove(os.path.join(os.getcwd(), os.path.basename(imageURL)))
	nextButton = soup.select('.next-button > a')
	url = nextButton[0].attrs['href']
urlFileList2.close()
urlFileList.close()

"""if not os.listdir(os.path.join(scriptPath, 'Images')) == []:
	fileNum = 0
	for file in os.walk(os.path.join(scriptPath, 'Images')):
		if fileNum >= len(file[2][fileNum]):
			break
		im = Image.open(os.path.join(os.getcwd(), file[2][fileNum])) # Variable file here is structured as a tuple with three lists in which 3rd list has images
		if im.mode == 'RGB':
			os.remove(file[2][fileNum])
		fileNum += 1"""

	



		
    
