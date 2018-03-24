class: center, middle
# Drupal 8<br>REST API Services
### Joseph Chin<br>Singapore Drupal Meetup<br>September 18, 2017


---
# Hello
* Joseph Chin
* Drupal Solution Architect since 2007
* Committee Member of the Singapore Drupal Meetup
* jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
* Follow along here: https://rawgit.com/jchin1968/presentations/master/2017-09-18_rest-api/index.html


---
# Topics
* Setting up REST Services on Drupal 8
* GET, POST, PUT and DELETE Requests
* Making Authenticated REST Calls
* Creating an endpoint using Views

???
* assumes you understand what is REST and why you'd want to use it.

---
# Setting Up REST Services
* Download REST UI module
* Enable REST UI and RESTful Web Services modules
* Enable and configure Content and User REST Resources
* Configure User Permissions
* Configure CORS settings in services.yml

???
## Modules 
* don't need HAL or HTTP Basic Authentication. 
* Serialization is required by RESTful Web Services
* REST UI not needed but very useful
# REST Resources
* Enable Content and User
* For each resource, enable all Request types: GET, POST, PATCH, DELETE, use JSON and cooke authentication 
## Permissions
* REST APIs follow the same permission as normal pages
* Article node publicly accessible for viewing
* User node is accessible only by administrator
## CORS
* See Next slide

---
# Configuring CORS
#### services.yml
```
cors.config:
    enabled: true 
    allowedHeaders: ['x-csrf-token','authorization','content-type','accept','origin','x-requested-with']
    allowedMethods: ['*']
    allowedOrigins: ['*']
    exposedHeaders: true 
    maxAge: 1000 
    supportsCredentials: true 
```
???
* CORS - cross origin resource sharing
* security feature to prevent a script from one domain to access resources (i.e. image, js, css, json) from another
* Drupal 8 is configured by default to prevent resource sharing 

---
# A Basic Request
#### Request
* Method: GET
* URL: http://rest-demo/node/1?_format=json

#### Response:
```
{
  "nid": [{"value": 1}], 
  ....,

  "status": [{"value": true}],
  "title": [{"value": "The Quick Brown Fox"}],
  ....,
  "body": [{"value": "<p>The quick brown fox jumped over the lazy dogs.</p>\r\n",
            "format": "basic_html",
            "summary": ""}],
  ....
}

```

???
* Simplest request. Go to a browser and simply enter a URL
* In Drupal 8, you require the query parameter _format=json to identify it is json 

---

# Logging In 
#### Request
* Method: POST
* Header: Content-Type: application/json
* URL: http://rest-demo/user/login?_format=json
* Body: 
```
{ "name":"joe", "pass":"test" }
```

#### Response
```
{
  "current_user":
    { "uid":"2", "name":"joe", "roles":["authenticated","administrator","editor","member"] },
* "csrf_token":"vVlThBvK_K0PNmkcSeNr1ntw8qxADc8v5h17Hugsiok",
  "logout_token":"zLskC3cKPp1rV00E7jxXihNk1Zk-uaAldsQiHa_VaSM"
}
```
* Retain CSRF Token from the JSON response for "unsafe" requests
* If on a server, retain the session cookie from the response HEADER

???
* Slightly more complicated as it expects an HTTP body which you can't provide through the URL
* Use something like Postman to construct the body
* Sends out an OPTIONS (pre-flight) request first to see if you are allowed to connect and then the second request is the actual POST with your login credentials
* When on a browser (i.e. using Javascript), the browser handles the session cookie.
* When on a server, i.e. PHP cURL commands, you will need to construct a HTTP header with the session cookie. 
* The CSRF token is required for "Unsafe" requests ie. POST, PATCH, DELETE. Safe requests such as GET do not require the token
*


---
# An Authenticated GET Request
#### Request
* Method: GET
* URL: http://rest-demo/user/2?_format=json

#### Response:
```
{
  "uid": [{"value": 2}], 
  ....,

  "name": [{"value": "joe"}],
  "mail": [{"value": "joe@test.com"}],
  "timezone": [{"value": "Asia/Singapore"}],
  "status": [{"value": true}],
  ....
}

```

???
*

---
# Creating an Article
#### Request
* Method: POST
* Header: 
  * Content-Type: application/json
  * X-CSRF-Token: HqzPEYXvo85j8QMEslnCKwHQezmCDWvi7yxI1h-U194
* URL: http://rest-demo/entity/node?_format=json
* Body:

```
      {
        "type":[{"target_id":"article"}],
        "title":[{"value":"Hello World"}],
        "body":[{"value":"How are you?"}]
      }
```

#### Response:
```
{
  "nid": [{"value": 2}], 
  ....,

  "type": [{"target_id": "article", ....}],
  "status": [{"value": true}],
  "title": [{"value": "Hello World"}],
  ....
}
```

???
*

---
# Updating an Article
#### Request
* Method: PATCH
* Header: 
  * Content-Type: application/json
  * X-CSRF-Token: HqzPEYXvo85j8QMEslnCKwHQezmCDWvi7yxI1h-U194
* URL: http://rest-demo/node/2?_format=json
* Body:

```
    {
*     "type":[{"target_id":"article"}],
      "title":[{"value":"Hello Joe"}]
    }
```

#### Response:
```
{
  "nid": [{"value": 2}], 
  ....,
  "title": [{"value": "Hello Joe"}],
  ....
}
```

???
*

---
# Deleting an Article
#### Request
* Method: DELETE
* Header: 
  * X-CSRF-Token: HqzPEYXvo85j8QMEslnCKwHQezmCDWvi7yxI1h-U194
* URL: http://rest-demo/node/2?_format=json
* Omit Content-Type and Body

#### Response:
* HTTP 204 - No Content

???
* HTTP 204 - Not an error message

---
# Creating a JSON List
* No lists provided by default
* Create using Views

???
* Accessing a single entity via REST is provided out of the box but to get a list requires creating views

---
# References
* https://www.drupal.org/docs/8/core/modules/rest/javascript-and-drupal-8-restful-web-services   

---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]
