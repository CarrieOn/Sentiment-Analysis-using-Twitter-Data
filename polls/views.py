from django.http import HttpResponse
from django.http import HttpRequest
from django.shortcuts import render
from django.template import loader
from django.shortcuts import render_to_response
from django.urls import reverse
from django.http import JsonResponse

import json
import urllib.request 
from urllib.parse import quote

import os
from mysite.settings import BASE_DIR

from django.views.decorators.csrf import csrf_exempt
from textblob import TextBlob



def sentimentAnalyze(dic,lang='en'):
	new_dic=[]
	positive,negative = 0,0
	for i in dic:
		if i['lang'][0] != lang:
			continue
		new_dic.append(i)
		t = i['full_text'][0]
		r = TextBlob(t).sentiment
		if r[0] >= 0:
			positive += 1
		else:
			negative += 1
	return [positive,negative],new_dic

# def ProcessCountry(dic):
# 	ret = {}
# 	index = 0
# 	for i in dic:
# 		name = i['country'][0]
# 		try:
# 			tmp = ret[name]
# 			ret.update({name:tmp+1})
# 		except KeyError:
# 			ret.update({name:1})

# 	countries,portion = [],[]
# 	for i in ['USA', 'Brazil', 'India']:
# 		try:
# 			portion.append(ret[i])
# 			countries.append(i)
# 		except KeyError:
# 			pass

# 	return countries, portion

def ProcessCountry(docs):
	usa = 0
	india = 0
	brazil = 0

	for i in docs:
		country = i['country'][0]
		if country == "USA":
			usa = usa + 1
		elif country == "India":
			india = india + 1
		elif country == "Brazil":
			brazil = brazil + 1
		else:
			pass

	countries = []
	portion = []

	if(usa >= 0):
		countries.append("USA")
		portion.append(usa)

	if(india >= 0):
		countries.append("India")
		portion.append(india)

	if(brazil >= 0):
		countries.append("Brazil")
		portion.append(brazil)


	print("coountries:")
	print(countries)
	print(portion)

	return countries, portion

@csrf_exempt
def index(request):
	query = request.POST.get('query')
	faceted_search = request.POST.get('country')
	inurl = ""

	if query is not None:
		inurl = "http://54.80.164.212:8983/solr/Project4/select?q=full_text%3A{q}&wt=json&rows=500".format(q = query)

	if faceted_search == "USA":
		inurl = "http://54.80.164.212:8983/solr/Project4/select?fq=country%3AUSA&q=full_text%3A{q}&wt=json&rows=500".format(q = query)


	elif faceted_search == "India":
		inurl = "http://54.80.164.212:8983/solr/Project4/select?fq=country%3AIndia&q=full_text%3A{q}&wt=json&rows=500".format(q = query)


	elif faceted_search == "Brazil":
		inurl = "http://54.80.164.212:8983/solr/Project4/select?fq=country%3ABrazil&q=full_text%3A{q}&wt=json&rows=500".format(q = query)

	else:
		pass

	if inurl != "":
		data = urllib.request.urlopen(inurl)
		docs = json.load(data)['response']['docs']

		pn,docs = sentimentAnalyze(docs)
		c,p = ProcessCountry(docs)

		followers = docs[0]["user.followers_count"][0]
		favourites = docs[0]["user.favourites_count"][0]
		friends = docs[0]["user.friends_count"][0]
		listed = docs[0]["user.listed_count"][0] #retweeted
		# statuses = docs[0]["user.statuses_count"][0] #retweets

		total1 = followers + friends
		total2 = favourites + listed

		pp = {
			"favourites_num": str(favourites),
			"favourites_ratio": str(100 - int(listed/total2 * 100)) + "%",

			"listed_num": str(listed),
			"listed_ration": str(int(listed/total2 * 100)) + "%",

			"friends_num": str(friends),
			"friends_ratio": str(100 - int(followers/total1 * 100)) + "%",

			"followers_num": str(followers),
			"followers_ratio": str(int(followers/total1 * 100)) + "%"
		}


		# cuibo python process
		temp = {}
		for i in docs:
			if i["tweet_date"][0][0:7] in temp.keys():
				temp[i["tweet_date"][0][0:7]] += 1
			else :
				temp[i["tweet_date"][0][0:7]] = 1


		date = sorted(temp.keys())
		amount = []
		for i in date :
			amount.append(temp[i])


		display = []
		count = 0
		for i in docs:
			single = {}
			single["profile"] = i["user.profile_image_url"]
			single["screen_name"] = i["user.screen_name"] # screen name is used for creating original link
			single["name"] = i ["user.name"]
			single["fullText"] = i["full_text"]
			single["date"] = i["tweet_date"][0][0:7]
			single["twitterId"] = i ['id']
			display.append(single)
			count +=1
			if count >= 8:
				break

		cb = {}
		cb["date"] = date
		cb["amount"] = amount
		cb["display"] = display

		dict = {
		"pp" : pp,
		"cb" : cb
		}


		return HttpResponse(json.dumps({"status": 1, "result": dict,'pie_country':c,'pie_portion':p,'sentiment':pn}))

	else:
		return render(request, "index.html")