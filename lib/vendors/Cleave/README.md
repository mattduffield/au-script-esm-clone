# CleaveJS
We are using our bundler to create an ESM version of the library.

This allow us to easily test and use the library in our own ESM projects.

The following is an example of using our service. We first need to post a JSON
request to the following URL:

https://us-central1-quoteone-staging.cloudfunctions.net/bundler

The body of the POST needs to look like the following:

```
{
	"mainjs":"import Cleave from 'https://unpkg.com/cleave.js@1.4.7/dist/cleave.js';\nexport {Cleave};"
	
}
```

To bring in addons for the library, perform another POST as follows to the same
URL:

```
{
	"mainjs":"import Cleave from 'https://unpkg.com/cleave.js@1.4.7/dist/cleave.js';\nexport {Cleave};"
	
}
```
