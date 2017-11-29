# Jester API

URIs that require authentication are marked with [A]

```

/api
|
+-/posts
| |-GET / - get all posts (optional ?since=date in query string)
| |-GET /:id -  get post :id
| |-DEL /:id - delete a post [A]
| |-POST /text - create a text post [A]
| +-POST /image - create an image post [A]
|
+-/users
| |- GET / - get all users the local user follows
| |- GET /:name - get the URL of user :name
| |- DEL /:name - unfollow user :name [A]
| +- POST / - follow a user [A]
|
+-/login
| |- POST / - provide username and password to log in
| +- DEL  / - log out
|
+-/config (mostly testing stuff) [A] for all items
  |- GET / - get all localuser data (username, password hash, blog name, etc)
  |- GET /logintest - deprecated
  |- GET /authtest - deprecated
  |- GET /createnew - reset the localuser to default values
  +- POST /changepassword - change the password on the localuser account


```

## POST request bodies

+ /text:
  * title: title of post
  * body: main text of the post
  * tags: comma separated list of tags, eg "heres,some,tags"

+ /image:
  * url: url of image
  * caption: text under image
  * tags: same as /text

+ /users:
  * name: name of blog to follow
  * url: url of blog (eg "localhost:3333" or "mycoolblog.com")

+ /login:
  * username: username for localuser account
  * password: password in plaintext

+ /config/changepassword:
  * password: new password to use, in plaintext
  (eventually will require old password and username)

## Next steps

+ Local configuration: there is currently a local user schema with information,
  but no direct way to edit this information, other than the password.

+ Caching: API needs a way to store posts from other users to speed up the user
  experience and keep track of which posts have been seen already

+ I changed my mind, the dashboard should be generated with the API. To add
  better asynchronous support in the future, it might be best to use some kind
  of socket interface to supply async updates on progress. socket.io is really
  easy to use, so it shouldn't be to crazy I don't think

## Generating a Dashboard

this must be done through the front end, as it relies on external http requests

### Posts.service (or equivalent):
+ get /users
+ for each user, check their last cached post from /cache/:user/last (tbi)
+ create an array of promises of requests to :userurl/posts?since=(date of last
  cached post)
  map a function that caches any posts that are returned, and gives some
  indication of its success or failure (a non-halting error message, perhaps)
  onto each promise
+ return the list of promises

### example usage in a component:
+ run the function to immediately receive a promise[] object
+ subscribe to each promise to get its success or failure message
+ display some kind of progress bar the updates as promises return, with
  some indication of which ones fail
+ run this all in a sidebar or something so the user can keep scrolling through
  their dashboard until the new posts have been retreived.

(it would be nice to be able to do this via the API but the responsive nature
of the problem makes it not able to do that well, I think.
