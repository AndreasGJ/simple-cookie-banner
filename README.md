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
const cookieSettings = CookieSettings({
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
| `type` | Choose *basic* if you don't want to show the points or else choose *simple* if you want to show it. | *basic*  |
| `structure` | Object which contains namings of classNames and id's |  |
| `structure.appId` | id of the wrapper element. | *cookie-settings* |
| `structure.innerWrapperClass` | Classname of inner div of the wrapper. | *cookie-settings__inner* |
| `content.*` |  Object which contains all text related strings. |  |
| `content.title` | Title in the cookie banner | *This website uses cookies* |
| `content.description` | The description right below the title in the cookie banner | *We use cookies to personalize our content and ads, to show you social media features and to analyze our traffic. We also share information about your use of our website with our social media, advertising and analytics partners. Our partners may combine this data with other information that you have provided to them or that they have collected from your use of their services.* |
| `content.submit` | Text in submit button | *Ok* |
| `content.showDetail` | Show button text | *Show details* |
| `content.readmoreAboutPolicy` | Insert read more about policy text. | *Read more about our cookie policy here:* |
| `content.readmoreAboutPolicyText` | Policy link text. | *Cookie policy* |
| `content.closeDetail` | Close button text | *Close details* |
| `content.corner` | SVG or HTML which renders the corner right corner for users already saved cookie settings | *SVG of cookie* |
| `points` | Array of different cookie categories. |  |
| `points.*.label` | Label shown beside the checkbox | |
| `points.*.key` | Key saved in the cookie if the checkbox is checked | |
| `points.*.value` | Default value for the given point | |
| `points.*.content` | Description about the given cookie category shown in the detail area. | |
| `events` | All the event hooks. Every key should have a function as value | |
| `events.onSubmit` | This function will be executed on submittion of the cookie banner. As first argument you will get the selected *points* | `null` |
| `events.onChecked` | This function will be executed when checking a point in the cookie banner. Argument 0 is the point object, argument 1 is a checked boolean | `null` |
| `events.onDetailToggle` | This function will be executed when show/hide the detail area in the cookie banner. Argument 0 is boolean `open`. | `null` |
| `events.onDetailItem` | This function will be executed when switching around the detail sidebar. Argument 0 is *index* of the point active. | `null` |
| `events.onCornerClicked` | This function will be executed when clicking the corner button. | `null` |
| `events.onCornerLoad` | This function will be executed when the corner button is loaded. | `null` |
| `events.appLoad` | This function will be executed when the cookie banner is loaded. | `null` |
| `policyLink` | Insert the link to the policy page | *false* |
| `delay` | ms. to wait until showing the cookie banner | 300 |
| `cookieDays`| How many days should the cookie be saved with the settings? | 365 |
| `cookieName` | The name of the cookie banner settings cookie. | *cookie-settings* |
| `useCorner` | If we need a way to open the modal again, then you can use the corner icon. | *false* |

## Cookie settings change

If you want to change the settings yourself, then you can change it by using the object functions returned when initiating the `CookieSettings()` method. It will return the following functions:

```
{   
    // Open the cookie banner
    open: function(){},
    
    // Close the cookie banner
    close: function(){},

    // Get the current settings (false: not chosen yet, 1: if basic then accepted, 0: if basic then declined, array: if simple then array of the selected options)
    getSettings: function(){},
    
    // Save settings by selected point keys in array.
    saveSettings: function (selectedPointKeys = []),

    // Save setting by key and isChecked value.
    saveSetting: function(pointKey, isChecked = false)
}
```

You can use the `cookieSettings.saveSettings(selectedPointKeys)` function to update all the user cookie settings. You can also update only 1 setting with the `cookieSettings.saveSetting(pointKey, isChecked = false)`.