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

## Settings

There is a number of different settings for the cookie banner. Here is a list of them:

| Key | Description | Default |
|---|---|---|
| `structure` | Object which contains namings of classNames and id's |  |
| `structure.appId` | id of the wrapper element. | *cookie-settings* |
| `structure.innerWrapperClass` | Classname of inner div of the wrapper. | *cookie-settings__inner* |
| `content.*` |  Object which contains all text related strings. |  |
| `content.title` | Title in the cookie banner | *This website uses cookies* |
| `content.description` | The description right below the title in the cookie banner | *We use cookies to personalize our content and ads, to show you social media features and to analyze our traffic. We also share information about your use of our website with our social media, advertising and analytics partners. Our partners may combine this data with other information that you have provided to them or that they have collected from your use of their services.* |
| `content.submit` | Text in submit button | *Ok* |
| `content.showDetail` | Show button text | *Show details* |
| `content.closeDetail` | Close button text | *Close details* |
| `content.corner` | SVG or HTML which renders the corner right corner for users already saved cookie settings | *SVG of cookie* |
| `points` | Array of different cookie categories. |  |
| `points.*.label` | Label shown beside the checkbox | |
| `points.*.key` | Key saved in the cookie if the checkbox is checked | |
| `points.*.value` | Default value for the given point | |
| `points.*.content` | Description about the given cookie category shown in the detail area. | |
| `events` | All the event hooks. Every key should have a function as value | |
| `events.onSubmit` | This function will be executed on submittion of the cookie banner. As first argument you will get the selected *points* | `null` |
| `delay` | ms. to wait until showing the cookie banner | 300 |
| `cookieDays`| How many days should the cookie be saved with the settings? | 365 |
| `cookieName` | The name of the cookie banner settings cookie. | *cookie-settings* |
