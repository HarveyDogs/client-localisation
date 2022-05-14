# Client localisation

This repository contains the localisation files for the Mirage Realms game client. Translations are welcomed so if you 
would like to see the game made available in your native language and have some free time to contribute you are in the 
right place :)

# How does it find the translations?

Put simply, the game code uses tags in place of words and phrases, and it looks up the value of these tags on the fly 
from the `bundle.properties` files in this repository. When the client is started it checks the locale of the device it 
is running on, and attempts to find a bundle.properties file for that locale.

If a locale-specific bundle.properties file has been found, the client will then use that. If not, it will use the 
default `bundle.properties` file, which in this case is in English. If we make sure we put the correct language translations 
in the correct properties files, we have a client that can run in multiple languages :)

# Creating new language bundles

Each translation is a file of the same name, but with the `language code` included with an underscore. You can find 
lists the abbreviated java `language codes` on google, but to give a few examples here:

```
English – en
German – de
French – fr
Russian – ru
Japanese – ja
Chinese – zh
Arabic – ar
```

The default language bundle is `bundle.properties`, that means if we wanted to add a German translation we would have 
to create a new file called `bundle_de.properties`, French it would be `bundle_fr.properties`, Russian 
`bundle_ru.properties`, etc.

# How the file works

So initially it's going to look really easy, there is simply a line by line tag to translation format (we call it a 
key-value pair in programming land) that looks like this:

```properties
some_key=Some key
something_else_description=I am something else but longer because I have description in my tag name
```

The vast majority of the translations are like this and have no further syntax. Please:

* Do not translate the keys, only translate the phrases
* Pay **very close attention** to capitalisation and punctuation
* Ask on discord if you are unsure of the context of a phrase

There are some other little tricks to keep an eye out for however. The most common is where the code will inject text 
into the translation dynamically at the specified points. Take for example the following phrase, notifying the player 
they have received a number of items.

```properties
recieved_n_of_n=Received {0} of {1}
```

Whenever you see this, the code places some additional text at the points marked with `{curly braces}`. In this case, 
the first `{0}` is replaced with a number, and the second `{1}` is replaced with an item name. It is very important 
the translations retain this information.

The second is much rarer but may be much more confusing, take the following example taken from the `redeem purchases` UI:

```properties
number_unredeemed_purchases_found_check_device={0} unredeemed {0,choice,1#purchase was|1<purchases were} found on your device, check your inventory :D
```

So what is happening here? We can see that a number is likely being injected in at runtime for `{0}`, but what about 
the next section?

`{0,choice,1#purchase was|1<purchases were}`

Well, this is how we are dealing with plurals. Essentially, if the number the code provides is `1`, then `purchase was` 
will be used. Any number `greater than 1` and `purchases were` will be used. This allows us to have a single translation 
that reads correctly regardless of if 1 or 50 unredeemed purchases were found.

Essentially, anything inside `{curley brackets}` is evaluated by the code as the translation is read, if you encounter 
something like this that you don't understand or can't figure out please reach out in the official discord server and 
we will help you :)

# Submitting a new language translation

There are two ways to submit a new language translation.

The first is to use git, branch, add your file, then simply open a pull request. The pull request will then be shared 
on the community discord server for other native speakers to look through and point out any issues or mistranslations.

If you don't know what git is, don't worry about it :) We will happily accept translation submissions via the official 
community discord server ([you can find it at the official website here](https://www.miragerealms.co.uk)), simply 
join and introduce yourself then post the file and someone will create the pull request on your behalf for community 
review.