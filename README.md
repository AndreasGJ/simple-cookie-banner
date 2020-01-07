# Simple cookie banner

If you need a simple way to add customizeable cookie banner which is GDPR friendly, then use this plugin. There is a lot of different tools which can generate it into your site by adding a `<script>`, but this will add thirdparty scripts into your site, and can therefor be hard to customize and listen to.

Here is an example of how it looks like out of the box:
![Cookie banner example](/docs/picture1.png)

And here is the cookie corner which will be visible when the user has saved the settings they need.
![Cookie banner saved example](/docs/picture2.png)

## Installation
Run the code below into the root of the project:
```
npm install simple-cookie-banner

// or

yarn add simple-cookie-banner
```

When its installed then add it to a `index.js` or `main.js` file, so its executed when loading the app:
**main.js**
```
import CookieSettings from "simple-cookie-banner";

...
CookieSettings({
    // Insert settings here
});
```

If you want some default css, then add the following @import into your css file:
```
@import "~simple-cookie-banner/cookie-settings.css";
```

Then build the script with `npm run dev` or `yarn dev` or what ever you use, and then you should see the cookie banner.
