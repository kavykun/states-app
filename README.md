# states-app
Does things with states

There should be no dependencies require to run thas as I have included them in index.html.
To run the app locally, I had to install http-server and run a simple command in the root directory.

HOW TO RUN:
```
sudo npm install -g http-server
```

In root folder, on terminal run to start the server and disable cache:
```
http-server -c-1
```

To simplify the process, I have used local storage as my primary platform for the database.
I would use mongodb or mysql if I had a node server running to keep all databases queries on the backend.

To reset the array of states, just clear browser cache.
