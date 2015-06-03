# API-Docs UI

## Overview
This will allow you to easily build your API documentation.

## How to use
Usage is very simple. A master file to manage your resources (api.json) and then you add your resources independent.

### api.json
	{
		"version":"1.0",
		"basePath":"http://api.domaine.tl/v1",
		"resources":[
			{
				"resource":"doc",
				"json":"example.json"
			}
		]
	}

### example.json
	{
		"version":"1.0",
		"resource":"doc",
		"endpoints":[
			{
				"endpoint":"example",
				"httpMethod":"GET",
				"description":"Example for the API Docs.",
				"shortDecription":"Example",
				"url":"http://api.domaine.tl/v1/doc/example",
				"parameters":[
					{
						"parameter":"id",
						"value":"(number)",
						"description": "ID of the doc example"
					}
				],
				"output":"{'key':'json','key_2':'json','key_2':'json'}"
			}
		]
	} 

- description (optional)
- shortDecription (optional)
- url (optional)
- parameters (optional)
- output (optional)