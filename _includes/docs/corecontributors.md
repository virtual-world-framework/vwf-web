# <a name="corecontributors">For Core Contributors</a>

This section is for those who don't just want to write VWF applications, but want to write new drivers and modify the VWF Core. If instead, you wish to develop VWF Applications on top of the framework, please follow the instructions above.

#### Prerequisites

Please make sure you have the following software packages installed:

1. Install [Node.js](http://nodejs.org/) for your specific environment.
2. Install **git** for your specific environment.
    * [TortoiseGit for Windows](https://code.google.com/p/tortoisegit/)
    * [Git Client For Windows](http://git-scm.com/download/win)
    * [Git Client for Mac](http://git-scm.com/download/mac)
    * [Git for Linux distributions](http://git-scm.com/download/linux)
        * Example: Ubuntu

        		sudo apt-get install git

#### Development 

Once your environment is set up, the easiest way to start developing is to:

1. Fork the [VWF repo](https://github.com/virtual-world-framework/vwf).
2. Clone your newly forked VWF repo to your local machine:

		git clone https://www.github.com/*username*/vwf --recursive -branch development

3. For additional VWF app examples, clone the [vwf-apps repo](https://github.com/virtual-world-framework/vwf-apps) into your public directory:

        git clone https://www.github.com/virtual-world-framework/vwf-apps /path/to/public/vwf-apps/

4. Edit any npm configuration settings necessary:

		npm config set registry http://registry.npmjs.org/

5. Set a network proxy, if required by your network:

		npm config set strict-ssl false
		npm config set proxy http://yourproxy.com:80
		npm config set https-proxy http://yourproxy.com:80

6. Run `npm install` from the command prompt in your VWF folder to install all the prerequisites for the VWF server.
7. Make your code modifications.
8. Start your server using `npm start` from the command prompt in your VWF folder to test your changes. The server runs on port 3000 in development by default. Use a modern browser to view the website and VWF apps. 
9. After you complete your updates and testing, submit a Pull Request back to the Virtual World Framework Team's VWF repo.

--------------------------

### Configuring HTTPS/SSL Traffic

VWF works over an HTTPS/SSL configuration. The following instructions set up a Linux environment running Thin web server with SSL. However, you may use SSL for any combination of operating system. The process below is an extremely simplified view of how SSL is implemented and what part the certificate plays in the entire process.

Normal web traffic is sent unencrypted over the Internet. That is, anyone with access to the right tools can snoop all of that traffic. Obviously, this can lead to problems, especially where security and privacy is necessary, such as in credit card data and bank transactions. The Secure Socket Layer is used to encrypt the data stream between the web server and the web client (the browser).

#### Step 1. Generate a Private Key

The *openssl* toolkit is used to generate an RSA Private Key and CSR (Certificate Signing Request). It can also be used to generate self-signed certificates which can be used for testing purposes or internal usage.

The first step is to create your RSA Private Key. This key is a 2048 bit key which is encrypted using Triple-DES and stored in a PEM format so that it is readable as ASCII text.

    openssl genrsa -des3 -out server.key 2048

Results:

    Generating RSA private key, 2048 bit long modulus<br/>
    .........................................................++++++<br/>
    ........++++++<br/>
    e is 65537 (0x10001)<br/>
    Enter PEM pass phrase:<br/>
    Verifying password - Enter PEM pass phrase:<br/><br/>
 
#### Step 2: Generate a CSR (Certificate Signing Request)

Once the private key is generated, a *Certificate Signing Request (CSR)* can be generated. The CSR is then used in one of two ways. Ideally, the CSR will be sent to a Certificate Authority, such as Thawte or Verisign who will verify the identity of the requestor and issue a signed certificate. The second option is to self-sign the CSR, which will be demonstrated in the next section.

During the generation of the CSR, you will be prompted for several pieces of information. These are the X.509 attributes of the certificate. One of the prompts will be for "Common Name (e.g., YOUR name)". It is important that this field be filled in with the fully qualified domain name of the server to be protected by SSL. If the website to be protected will be *https://public.akadia.com*, then enter *public.akadia.com* at this prompt. The command to generate the CSR is as follows:

    openssl req -new -key server.key -out server.csr

Results:

    Country Name (2 letter code) \[GB\]:US<br/>
    State or Province Name (full name) \[Berkshire\]:Florida<br/>
    Locality Name (eg, city) \[Newbury\]:Orlando<br/>
    Organization Name (eg, company) \[My Company Ltd\]:Test<br/>
    Organizational Unit Name (eg, section) []:Test Technology<br/>
    Common Name (eg, your name or your server's hostname) []:public.whatever.com<br/>
    Email Address []:test@test.com<br/>
    Please enter the following 'extra' attributes<br/>
    to be sent with your certificate request<br/>
    A challenge password:<br/>
    An optional company name:<br/><br/>

#### Step 3: Remove Passphrase from Key

One unfortunate side-effect of the pass-phrased private key is that Apache will ask for the pass-phrase each time the web server is started. Obviously this is not necessarily convenient as someone will not always be around to type in the pass-phrase, such as after a reboot or crash. mod_ssl includes the ability to use an external program in place of the built-in pass-phrase dialog. However, this is not necessarily the most secure option either. It is possible to remove the Triple-DES encryption from the key, thereby no longer needing to type in a pass-phrase. If the private key is no longer encrypted, it is critical that this file only be readable by the root user! If your system is ever compromised and a third party obtains your unencrypted private key, the corresponding certificate will need to be revoked. With that being said, use the following command to remove the pass-phrase from the key:

    cp server.key server.key.org
    openssl rsa -in server.key.org -out server.key

The newly created server.key file has no more passphrase in it.

    -rw-r--r-- 1 root root 745 Jun 29 12:19 server.csr
    -rw-r--r-- 1 root root 891 Jun 29 13:22 server.key
    -rw-r--r-- 1 root root 963 Jun 29 13:22 server.key.org

#### Step 4: Generating a Self-Signed Certificate

At this point you will need to generate a self-signed certificate because you either don't plan on having your certificate signed by a CA, or you wish to test your new SSL implementation while the CA is signing your certificate. This temporary certificate will generate an error in the client browser to the effect that the signing certificate authority is unknown and not trusted.

To generate a temporary certificate which is good for 365 days, issue the following command:

    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

Results:

    Signature ok<br/>
    subject=/C=CH/ST=Test/L=TestName/O=Test Co/OU=Test Technology/CN=public.whatever.com/Email=test@test.com<br/>
    Getting Private key<br/>

#### Step 5: Installing the Private Key and Certificate

Thin is capable of reading SSL within a configuration yml file for startup.  First we move the certificates generated to a permanent location.

    mkdir /etc/thin_ssl
    cp server.crt /etc/thin_ssl/ssl.crt
    cp server.key /etc/thin_ssl/ssl.key

At this point you will want to add three lines to your Thin Server yml file:

    ssl: true
    ssl_cert_file: /etc/thin_ssl/ssl.crt
    ssl_key_file: /etc/thin_ssl/ssl.key

Restart your thin servers at this point and you should now be able to connect to your server using *https://*.
Remember that SSL traffic is on port 443, and you will need to have this port open in your firewall.
