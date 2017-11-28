# Jester API

The API is simple at the moment, and has no authentication. This is it so far:

```

/api
|-/posts
| |-GET / - get all posts (optional ?since=date in query string)
| |-GET /:id -  get post :id
| |-DEL /:id - delete a post
| |-POST /text - create a text post
| +-POST /image - create an image post
|
+-/users
  |- GET / - get all users the local user follows
  |- GET /:name - get the URL of user :name
  |- DEL /:name - unfollow user :name
  +- POST / - follow a user

```

## POST request bodies

/text:
title: title of post
body: main text of the post
tags: comma separated list of tags, eg "heres,some,tags"

/image:
url: url of image
caption: text under image
tags: same as /text

/users:
name: name of blog to follow
url: url of blog (eg "localhost:3333" or "mycoolblog.com")

## Next steps

+ Local configuration: the local user is currently hardcoded as
  {name:"delearyus",url:"localhost:3333"}, this should be configurable instead.

+ Authentication: All POST and DELETE requests should require an authentication
  token to be submitted as a cookie. this cookie can be obtained via:

```
  /api/auth
  |- POST /login: submit username and password to create a session and receive
  |               a token
  +- DEL /login: log out (delete the current session) (requires auth token)
```

  sessions will have their own DB schema:
```javascript
    {
        token: ID
        expires: Date //by default, something like 24 hours after login or
                      //something
    }
```
  the DB will also have a local user collection (with one entry):
```javascript
    {
        username: String,
        password: String, //hash of password, obvs
        url:      String, //url to give out to people following the blog
        name:     String, //blog name to give out to followers and put on posts
        //maybe some other data, as things progress?
    }
```

  on POST /login:
    + verify that username matches the one in localuser
    + hash the password and check it against the pwhash in localuser
    + (if either do not match, return {success:false, message: "Invalid
      Credentials"} (ie do not tell which one was wrong)
    + Next, create a new session object with a randomly generated token (of
      sufficient length),  and expires 1 day from now (or whatever)
    + Return {success:true, token: [token]}, with a cookie header which also
      contains the token so that it doesn't have to be dealt with manually

  on DEL /login:
    + Check the cookie body, and get the token
    + if the token does not exist, is not valid, or does not belong to an
      active session, return {success: false, message: "Invalid token"}
    + otherwise, delete the session and return {success:true, message:"session
      deleted"}
  
  on Auth Check:
    + Get the auth token from the cookies (or from the post body if none in
      cookies)
    + check for any active sessions with the token, and make sure they have not
      expired, then forward the request to the next middleware
    + if session is expired, return {success:false,message:"Session Expired"}
    + if token is invalid or nonexistant return {success:false,message:"Invalid
      Token"}

## Generating a Dashboard

this must be done through the front end, as it relies on external http requests

Posts.service (or equivalent):
+ get /users
+ for each user, check their last cached post from /cache/:user/last (tbi)
+ create an array of promises of requests to :userurl/posts?since=(date of last
  cached post)
  map a function that caches any posts that are returned, and gives some
  indication of its success or failure (a non-halting error message, perhaps)
  onto each promise
+ return the list of promises

example usage in a component:
+ run the function to immediately receive a promise[] object
+ subscribe to each promise to get its success or failure message
+ display some kind of progress bar the updates as promises return, with
  some indication of which ones fail
+ run this all in a sidebar or something so the user can keep scrolling through
  their dashboard until the new posts have been retreived.

(it would be nice to be able to do this via the API but the responsive nature
of the problem makes it not able to do that well, I think.
