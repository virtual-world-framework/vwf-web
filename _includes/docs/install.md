# <a name="install">Installation</a>

--------------------------

## Windows 

<!--

Download and run the VWF Windows Installer. 

Launch a command prompt window and create a new VWF application:

    c:\> vwf create MyApp

Change into your new application folder and start the  server.

    c:\> cd MyApp
    c:\MyApp> vwf

-->

Download and extract the latest [Windows build](http://download.virtualworldframework.com/files/vwf-0.6.23.windows-full.zip).

Install [Node.js](http://nodejs.org/).

Launch a command prompt and navigate to your *vwf* folder. 

Edit npm configuration settings:

    npm config set registry http://registry.npmjs.org/

Note: You may also need to set a proxy if required by your network:

    npm config set strict-ssl false
    npm config set proxy http://yourproxy.com:80
    npm config set https-proxy http://yourproxy.com:80

Install all the prerequisites for the VWF server:

    npm install

Start the server:

    npm start

Navigate to "localhost:3000/duck" to see the sample duck application from your local machine.

## Mac OS X / Linux 

NOTE: On Mac OS X, please make sure you have [Xcode Command Line Tools](https://developer.apple.com/xcode/) installed prior to executing the script.

Execute the following command at your terminal/shell prompt:

    $ curl -L http://get.virtual.wf  | sh
	
Launch a command prompt window and create a new VWF application:

    $ vwf create MyApp

Change into your new folder application, and start the server.

    $ cd MyApp
    MyApp$ vwf

--------------------------
