![logo](https://user-images.githubusercontent.com/88457702/151228965-257a7283-8a20-46bd-aae2-45ac676ab009.png)


Digital Eclipse
===============

Summary
-------

Digital Eclipse strives to recreate the experience of listening to vinyl
records in a digital environment. It is a way for you to host your own
music on the cloud so you can listen to your records on the go.
Everything from how you select, play, pause, and stop music was designed
to mimic the behaviors you have to go through to play vinyl records.

How to use Digital Eclipse
--------------------------

Using [Digital Eclipse](https://digital-eclipse.herokuapp.com) is purposefully different from how you interact
with other streaming platforms. For starters, let us look at how you
would select music:


![](https://user-images.githubusercontent.com/88457702/151243059-5c9b413a-7449-4321-83f0-d042bf9fdbb8.gif)



You may notice that you do not select individual songs, rather you
select a side to play. This is because that is consistent with how
records work and makes recording easier as you just need to upload one
file containing all of the music on one side of a record instead of
trying to break it apart.

Pausing and then resuming is similarly easy, just click on the spinning
record:

![playingandresuming(1)](https://user-images.githubusercontent.com/88457702/151247424-52a295cf-4767-4b20-8740-bbc283249f89.gif) 


Stopping the music or choosing a new side to listen to is easy as well,
drag the spinning record to remove it entirely:

![stopandreselect(1)](https://user-images.githubusercontent.com/88457702/151395759-b9a4e376-675b-4349-92ce-18d2c95560be.gif)


To upload music, just click the Add Album button and go through the
forms. To ensure the best experience, it is recommended to use flac as
your audio file format and record at a 96000hz sample rate. The open
source software [Audacity](https://www.audacityteam.org/), makes this
easy.

Hosting Digital Eclipse
-----------------------

If you wish to host Digital Eclipse on your local machine or on a
server, just download the files and install using the docker file and
connecting it to a PostgreSQL databse and AWS S3 bucket. Or if you wish
you can:

1\. Run pip install

2\. Create a .env folder with the correct environment variables
(SECRET\_KEY and AWS variables required)

3\. Run flask db init

4\. Run flask db upgrade

5\. Run flask run

6\. Navigate to /frontend and run npm install

7\. Run npm start and navigate to
[http://localhost:3000](http://localhost:3000/)

Technology used
---------------

Digital Eclipse features some key technology to make it work. On the
back end we have:

\- Flask

\- PostgreSQL

\- SocketIO

\- Gunicorn (for production server)

\- Eventlet

And on the front end:

\- React

\- Redux

\- AudioNodes

\- Direct uploading to AWS S3

When combined together, these technologies have allowed the development
of Digital Eclipse to be plausible, and hopefully future updates will
include the use of A-Frame to bring the Digital Eclipse experience to
WebXR.

