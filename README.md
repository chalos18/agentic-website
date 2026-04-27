# Portfolio Application

To test the application use the following commands

docker build .
docker run -p 5000:3000 <image_tag>

-p specifies port forwarding which allows you to access the application in your container at host 3000 but exposed to port 5000

You can then find the app exposed to http://127.0.0.1:5000/