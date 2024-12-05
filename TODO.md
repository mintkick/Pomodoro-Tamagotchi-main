# Things to do

## User Cookie
 - [] The post /user should set a cookie called userId

Look for this code:
app.post('/user'

app.setCookie('userId', userData.userID)

## Get Tasks

Look for this code:
const tasks = await Task.getTasks(); // No longer passing userId

we need to pass userId, so we can look it up in the cookie.

const userId = app.cookie('userId')
const tasks = await Task.getTasks(userId);

## Creating tasks
Get the user cookie for userId
add that to the task that you are about to save to the database, so we can look it up later