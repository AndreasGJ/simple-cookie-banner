if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

const cookieIcon = require("./cookieIcon.js");
var cookieDomain = null;

const defaultParams = {
structure: {
  appId: "cookie-settings",
  innerWrapperClass: "cookie-settings__inner"
},
content: {
  title: "This website uses cookies",
  description:
    "We use cookies to personalize our content and ads, to show you social media features and to analyze our traffic. We also share information about your use of our website with our social media, advertising and analytics partners. Our partners may combine this data with other information that you have provided to them or that they have collected from your use of their services.",
  showDetail: "Show details",
  closeDetail: "Close details",
  readmoreAboutPolicy: "Read more about our cookie policy here:",
  readmoreAboutPolicyText: "Cookie policy",
  corner: cookieIcon
},
buttons: [
  {type: 'decline', label: 'No thanks'},
  {type: 'submit', label: 'Ok'},
],
points: [
  {
    label: "Statistics",
    key: "statistic",
    value: false,
    content: "Headline statistics"
  },
  {
    label: "Marketing",
    key: "marketing",
    value: false,
    content: "Headline marketing"
  }
],
events: {
  onSubmit: null,
  onLoad: null
},
type: "basic",
policyLink: false,
useCorner: false,
delay: 300,
cookieDays: 365,
cookieName: "cookie-settings",
cookieDomain: false,
};
const setCookie = function(cname, cvalue) {
let expires = "";
const exdays = arguments[2] || 0;
if (exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  expires = "expires=" + d.toUTCString() + ";";
}
const domain = cookieDomain ? ';domain=' + cookieDomain : '';
document.cookie = cname + "=" + cvalue + ";" + expires + "path=/" + domain;
};

const getCookie = function(cname) {
var name = cname + "=";
var ca = document.cookie.split(";");
for (var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == " ") {
    c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
  }
}
return "";
};

const saveCookiePoints = function(
points,
selectedKeys,
settings
) {
const cookieDays = settings.cookieDays;
const cookieName = settings.cookieName;
const type = settings.type || 'basic';
const selectedPoints =
  selectedKeys && typeof selectedKeys === "object"
    ? points.filter(function(point) {
        return selectedKeys.indexOf(point.key) >= 0
      })
    : points.filter(function(point) {
        return point.value
    });
let cookieValue =
  "|" + selectedPoints.map(function(point) {
      return point.key
  }).join("|") + "|";
if (type === "basic") {
  cookieValue = points.length > 0 ? "true" : "false";
}
setCookie(cookieName, cookieValue, cookieDays);

return selectedPoints;
};

const activatePointSidebar = function(element, app) {
// Activate point sidebar menu item.
const hasActivePoint = app.querySelector(".point-sidebar li.active");
if (hasActivePoint && hasActivePoint !== element) {
  hasActivePoint.classList.remove("active");
}
element.classList.add("active");

// Activate point content menu item.
const pointContent = app.querySelector(element.getAttribute("data-target"));
const hasActivePointContent = app.querySelector(
  ".point-contents .point-content.active"
);
if (hasActivePointContent) {
  hasActivePointContent.classList.remove("active");
}
pointContent.classList.add("active");
};

const appEventSetup = function(app, settings) {
const points = settings.points || [];
const cookieName = settings.cookieName;
const cookieDays = settings.cookieDays;
const onChecked = settings.events.onChecked;
const onSubmit = settings.events.onSubmit;
const onDetailItem = settings.events.onDetailItem;
const onDetailToggle = settings.events.onDetailToggle;

const pointInputs = app.querySelectorAll('input[type="checkbox"]');
for (let i = 0; i < pointInputs.length; i++) {
  pointInputs[i].addEventListener("change", function(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    const checked = event.target.checked;
    if(points[index]){
      points[index].value = checked ? true : false;
    }

    const li = app.querySelector(
      ".point-sidebar li:nth-child(" + (index + 1) + ")"
    );
    if (li) {
      if (checked) {
        li.classList.add("checked");
      } else {
        li.classList.remove("checked");
      }

      // On checked point
      if (onChecked) {
        onChecked(points[index], checked);
      }
    }
  });
}

// Submit button
const submitBtn = app.querySelector(
  '.cookie-settings__submit[type="button"]'
);
if (submitBtn) {
  submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    const selectedPoints = saveCookiePoints(points, null, settings);

    // On submit
    if (onSubmit) {
      onSubmit(settings.type === "basic" || selectedPoints);
    }

    closeApp(settings);
  });
}

// Decline button
const declineBtn = app.querySelector(
  '.cookie-settings__decline[type="button"]'
);
if (declineBtn) {
  declineBtn.addEventListener("click", function(event) {
    event.preventDefault();

    saveCookiePoints([], null, settings);

    // On submit
    if (onSubmit) {
      onSubmit(settings.type === "basic" ? false : []);
    }

    closeApp(settings);

    loadCorner(settings);
  });
}

// Accept button
const acceptAllBtn = app.querySelector(
  '.cookie-settings__accept-all[type="button"]'
);
if (acceptAllBtn) {
  acceptAllBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const selectedPoints = settings.points.map(function(point) {
      return Object.assign({}, point, {value: true});
    });
    saveCookiePoints(selectedPoints, null, settings);

    // On submit
    if (onSubmit) {
      onSubmit(selectedPoints);
    }

    closeApp(settings);

    loadCorner(settings);
  });
}

// Decline button
const detailBtns = app.querySelectorAll(
  '.cookie-settings__action-details[type="button"]'
);
if (detailBtns && detailBtns.length > 0) {
  for (let i = 0; i < detailBtns.length; i++) {
    detailBtns[i].addEventListener("click", function(event) {
      event.preventDefault();

      app.classList.toggle("open");

      // On detail open/close
      if (onDetailToggle) {
        onDetailToggle(app.classList.contains("open"));
      }
    });
  }
}

// Custom button
const customBtn = app.querySelector(
  '.cookie-settings__custom[type="button"]'
);
if (customBtn) {
  customBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const index = parseInt(event.target.getAttribute('data-id'));

    const button = settings.buttons[index];

    if(button && typeof button.onClick === "function"){
      button.onClick({
        closeApp: closeApp,
        saveCookiePoints: saveCookiePoints,
        settings: settings
      });
    }
  });
}

const pointsSidebar = app.querySelectorAll(".point-sidebar li");
if (pointsSidebar && pointsSidebar.length > 0) {
  for (let i = 0; i < pointsSidebar.length; i++) {
    if (i === 0) {
      activatePointSidebar(pointsSidebar[i], app);
    }
    pointsSidebar[i].addEventListener("click", function(event) {
      const index = parseInt(event.currentTarget.getAttribute('data-index'));
      activatePointSidebar(event.currentTarget, app);

      // On detail item.
      if (onDetailItem) {
        onDetailItem(index);
      }
    });
  }
}
};
const hasPointSelected = function(cookieName, point) {
let cookiePoints = getCookie(cookieName);

return (
  (!cookiePoints && point.value) ||
  (cookiePoints && cookiePoints.indexOf(point.key) >= 0)
);
};
let app;
const closeApp = function(settings) {
const force = arguments[1] || false;

if (app) {
  app.classList.remove("loaded");
  if (force) {
    app.parentNode.removeChild(app);
  } else {
    setTimeout(function() {
      app.parentNode.removeChild(app);
    }, 500);
  }

  loadCorner(settings);
}
};
const loadApp = function(settings) {
const structure = settings.structure || {};
const content = settings.content || {};
const events = settings.events || {};
const type = settings.type;
const cookieName = settings.cookieName;

const hasApp = document.getElementById(structure.appId);

if (hasApp) {
  app = hasApp;
} else {
  app = document.createElement("div");
  app.id = structure.appId;
  app.className = 'cookie-settings cookie-settings--' + type;
}

// Set the current points
settings.points = settings.points.map(function(point) {
  return Object.assign({}, point, {
    value: hasPointSelected(cookieName, point)
  });
});

const pointHTML = settings.points
  .map(function(point, index) {
    return '<div class="cookie-settings__action-item' + (point.disabled ? ' cookie-settings__action-item--disabled' : '') + (point.value ? ' cookie-settings__action-item--checked' : '') + '">'+
          '<label class="cookie-settings__action-item__label">'+
              '<input class="cookie-settings__action-item__input" data-index="'+index+'" type="checkbox" value="' + (
                point.key
              ) + '" ' + (point.value ? "checked" : "") + (point.disabled ? ' disabled="disabled"' : '') + ' />'+
              '<span class="cookie-settings__action-item__text">'+(
                point.label
              )+'</span>'+
          '</label>'+
      '</div>';
  })
  .join("");
const pointSidebar = settings.points
  .map(function(point, index) {
    return '<li class="point-sidebar__item' +(
      point.value ? " checked" : "") + '" data-target=".point-content--' + index + '" data-index="'+index+'">'+
          point.label +
      '</li>';
  })
  .join("");
const pointDetailContents = settings.points
  .map(function(point, index) {
    return '<div class="point-content point-content--'+index+'">' +
          '<div class="point-content__title">' + point.label + '</div>' +
          '<div class="point-content__text">' + point.content + '</div>' +
      '</div>';
  })
  .join("");

app.innerHTML = '<div class="cookie-settings__inner">' +
      '<div class="cookie-settings__content-wrapper">' +
          '<div class="cookie-settings__title">' + content.title + '</div>' +
          '<div class="cookie-settings__description">' + content.description + '</div>'+
      '</div>' +
      '<div class="cookie-settings__actions">' +
          (type === "simple"
              ? '<div class="cookie-settings__actions-wrapper">'+
              '<div class="cookie-settings__actions-inner">'+
                  pointHTML +
              '</div>'+
              '<button class="cookie-settings__action-details cookie-settings__action-details__open" type="button">' + content.showDetail + '</button>' +
              '<button class="cookie-settings__action-details cookie-settings__action-details__close" type="button">' + content.closeDetail + '</button>'+
          '</div>'
              : "") +

          '<div class="cookie-settings__actions-btns">' +
              settings.buttons.map(function(button, index) {
                return '<button class="cookie-settings__'+button.type+'" data-id="'+index+'" type="button">'+button.label+'</button>';
              }).join('') +
          '</div>' +
      '</div>' +
      (type === "simple"
          ? '<div class="cookie-settings__details-wrapper">'+
              '<div class="cookie-settings__details-inner">'+
                  '<div class="cookie-settings__details-sidebar">'+
                      '<ul class="point-sidebar">' +
                          pointSidebar +
                      '</ul>'+
                  '</div>'+
                  '<div class="cookie-settings__details-content">'+
                      '<div class="point-contents">'+
                          pointDetailContents+
                      '</div>'+
                  '</div>'+
              '</div>'+
          '</div>'
          : ''
      ) +
      (
        settings.policyLink
          ? '<div class="cookie-settings__readmore-policy">'+
          '<p class="readmore-policy-description">'+content.readmoreAboutPolicy + '</p>'+
          '<a href="'+settings.policyLink+'" target="_blank" title="'+content.readmoreAboutPolicyText+'">'+content.readmoreAboutPolicyText+'</a>'+
      '</div>'
          : ""
      ) +
  '</div>';

if (!hasApp) {
  document.body.appendChild(app);
}

appEventSetup(app, settings);

setTimeout(function() {
  app.classList.add("loaded");
}, settings.delay);
};
const loadCorner = function(settings) {
  const useCorner = settings.useCorner;
  const onCornerClicked = settings.events.onCornerClicked;
  const onCornerLoad = settings.events.onCornerLoad;

if (useCorner) {
  const corner = document.createElement("div");
  corner.className = "cookie-settings-corner";
  corner.innerHTML = settings.content.corner;

  document.body.appendChild(corner);

  corner.addEventListener("click", function(event) {
    event.preventDefault();

    corner.parentNode.removeChild(corner);
    loadApp(settings);

    // On corner clicked.
    if (onCornerClicked) {
      onCornerClicked();
    }
  });
}

// On corner loaded.
if (onCornerLoad) {
  onCornerLoad();
}
};

const initiate = function() {
const params = arguments[0] || {};
const settings = Object.assign({},
  defaultParams,
  params,
  {
  structure: Object.assign({},defaultParams.structure, params.structure || {}),
  content: Object.assign({}, defaultParams.content, params.content || {}),
});

cookieDomain = settings.cookieDomain;
const structure = settings.structure || {};
const cookieName = settings.cookieName;
const points = settings.points || [];

app = document.getElementById(structure.appId);

const hasCookie = getCookie(cookieName);

if (!hasCookie) {
  loadApp(settings);
} else {
  closeApp(settings, true);
  loadCorner(settings);
}

const getSettings = function() {
  const value = getCookie(settings.cookieName);

  if (!value) return false;

  if (settings.type === "basic") {
    return value === "true" ? 1 : 0;
  }
  if (settings.type === "simple") {
    return value.replace(/(^\||\|$)/g, "").split("|");
  }

  return null;
};

// If the onLoad function is set then execute it with the given settings.
if (settings.events && settings.events.onLoad) {
  settings.events.onLoad(getSettings());
}

return {
  open: function() {
    return loadApp(settings);
  },
  close: function() {
    return closeApp(settings);
  },
  getSettings: getSettings,
  // Save the new settings.
  saveSettings: function(selectedPoints) {
    return saveCookiePoints(points, selectedPoints || [], settings);
  },
  // Save specific setting
  saveSetting: function(pointKey) {
    const isChecked = arguments[1] || false;
    const selectedKeys = points.filter(function(point){
        return point.key;
    });
    const hasPoint = selectedKeys.indexOf(pointKey);
    if (isChecked && hasPoint === -1) {
      selectedKeys.push(pointKey);
    } else if (!isChecked && hasPoint >= 0) {
      selectedKeys.splice(hasPoint, 1);
    }

    return saveCookiePoints(points, selectedKeys, settings);
  }
};
};

module.exports = initiate;
