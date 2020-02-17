const cookieIcon = require("./cookieIcon.js");

const defaultParams = {
    structure: {
        appId: "cookie-settings",
        innerWrapperClass: "cookie-settings__inner"
    },
    content: {
        title: "This website uses cookies",
        description:
            "We use cookies to personalize our content and ads, to show you social media features and to analyze our traffic. We also share information about your use of our website with our social media, advertising and analytics partners. Our partners may combine this data with other information that you have provided to them or that they have collected from your use of their services.",
        submit: "Ok",
        decline: "No thanks",
        showDetail: "Show details",
        closeDetail: "Close details",
        readmoreAboutPolicy: "Read more about our cookie policy here:",
        readmoreAboutPolicyText: "Cookie policy",
        corner: cookieIcon
    },
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
    cookieName: "cookie-settings"
};
const setCookie = (cname, cvalue, exdays = 0) => {
    let expires = "";
    if (exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        expires = "expires=" + d.toUTCString() + ";";
    }
    document.cookie = cname + "=" + cvalue + ";" + expires + "path=/";
};

const getCookie = cname => {
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

const saveCookiePoints = (
    points = [],
    selectedKeys = null,
    { type = "basic", cookieDays, cookieName }
) => {
    const selectedPoints =
        selectedKeys && typeof selectedKeys === "object"
            ? points.filter(point => selectedKeys.indexOf(point.key) >= 0)
            : points.filter(point => point.value);
    let cookieValue =
        "|" + selectedPoints.map(point => point.key).join("|") + "|";
    if (type === "basic") {
        cookieValue = points.length > 0 ? "true" : "false";
    }
    setCookie(cookieName, cookieValue, cookieDays);

    return selectedPoints;
};

const activatePointSidebar = (element, app) => {
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

const appEventSetup = (app, settings = {}) => {
    const {
        points = [],
        cookieName,
        cookieDays,
        events: { onChecked, onSubmit, onDetailToggle, onDetailItem } = {}
    } = settings;

    const pointInputs = app.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < pointInputs.length; i++) {
        pointInputs[i].addEventListener("change", event => {
            const checked = event.target.checked;
            points[i].value = checked ? true : false;
            const li = app.querySelector(
                ".point-sidebar li:nth-child(" + (i + 1) + ")"
            );
            if (li) {
                if (checked) {
                    li.classList.add("checked");
                } else {
                    li.classList.remove("checked");
                }

                // On checked point
                if (onChecked) {
                    onChecked(points[i], checked);
                }
            }
        });
    }

    // Submit button
    const submitBtn = app.querySelector(
        '.cookie-settings__submit[type="button"]'
    );
    if (submitBtn) {
        submitBtn.addEventListener("click", event => {
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
        declineBtn.addEventListener("click", event => {
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

    const detailBtns = app.querySelectorAll(
        '.cookie-settings__action-details[type="button"]'
    );
    if (detailBtns && detailBtns.length > 0) {
        for (let i = 0; i < detailBtns.length; i++) {
            detailBtns[i].addEventListener("click", event => {
                event.preventDefault();

                app.classList.toggle("open");

                // On detail open/close
                if (onDetailToggle) {
                    onDetailToggle(app.classList.contains("open"));
                }
            });
        }
    }

    const pointsSidebar = app.querySelectorAll(".point-sidebar li");
    if (pointsSidebar && pointsSidebar.length > 0) {
        for (let i = 0; i < pointsSidebar.length; i++) {
            if (i === 0) {
                activatePointSidebar(pointsSidebar[i], app);
            }
            pointsSidebar[i].addEventListener("click", function(event) {
                activatePointSidebar(event.currentTarget, app);

                // On detail item.
                if (onDetailItem) {
                    onDetailItem(i);
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
const closeApp = (settings = {}, force = false) => {
    if (app) {
        app.classList.remove("loaded");
        if (force) {
            app.parentNode.removeChild(app);
        } else {
            setTimeout(() => {
                app.parentNode.removeChild(app);
            }, 500);
        }

        loadCorner(settings);
    }
};
const loadApp = function(settings = {}) {
    const {
        structure = {},
        content = {},
        events = {},
        type,
        cookieName
    } = settings;
    const hasApp = document.getElementById(structure.appId);

    if (hasApp) {
        app = hasApp;
    } else {
        app = document.createElement("div");
        app.id = structure.appId;
        app.className = "cookie-settings";
    }

    // Set the current points
    settings.points = settings.points.map(function(point) {
        return Object.assign({}, point, {
            value: hasPointSelected(cookieName, point)
        });
    });

    const pointHTML = settings.points
        .map(function(point) {
            return `<div class="cookie-settings__action-item">
            <label class="cookie-settings__action-item__label">
                <input class="cookie-settings__action-item__input" type="checkbox" value="${
                    point.key
                }" ${point.value ? "checked" : ""} />
                <span class="cookie-settings__action-item__text">${
                    point.label
                }</span>
            </label>
        </div>`;
        })
        .join("");
    const pointSidebar = settings.points
        .map(function(point, index) {
            return `<li class="point-sidebar__item${
                point.value ? " checked" : ""
            }" data-target=".point-content--${index}">
            ${point.label}
        </li>`;
        })
        .join("");
    const pointDetailContents = settings.points
        .map(function(point, index) {
            return `<div class="point-content point-content--${index}">
            <div class="point-content__title">${point.label}</div>
            <div class="point-content__text">${point.content}</div>
        </div>`;
        })
        .join("");

    app.innerHTML = `<div class="cookie-settings__inner">
        <div class="cookie-settings__title">${content.title}</div>
        <div class="cookie-settings__description">${content.description}</div>
        <div class="cookie-settings__actions">
            ${
                type === "simple"
                    ? `<div class="cookie-settings__actions-wrapper">
                <div class="cookie-settings__actions-inner">
                    ${pointHTML}
                </div>
                <button class="cookie-settings__action-details cookie-settings__action-details__open" type="button">${content.showDetail}</button>
                <button class="cookie-settings__action-details cookie-settings__action-details__close" type="button">${content.closeDetail}</button>
            </div>`
                    : ""
            }
            <div class="cookie-settings__actions-btns">
                <button class="cookie-settings__submit" type="button">
                    ${content.submit}
                </button>
                <button class="cookie-settings__decline" type="button">
                    ${content.decline}
                </button>
            </div>
        </div>
        ${
            type === "simple"
                ? `<div class="cookie-settings__details-wrapper">
                <div class="cookie-settings__details-inner">
                    <div class="cookie-settings__details-sidebar">
                        <ul class="point-sidebar">
                            ${pointSidebar}
                        </ul>
                    </div>
                    <div class="cookie-settings__details-content">
                        <div class="point-contents">
                            ${pointDetailContents}
                        </div>
                    </div>
                </div>
            </div>`
                : ``
        }

        ${
            settings.policyLink
                ? `<div class="cookie-settings__readmore-policy">
            <p class="readmore-policy-description">${content.readmoreAboutPolicy}</p>
            <a href="${settings.policyLink}" target="_blank" title="${content.readmoreAboutPolicyText}">${content.readmoreAboutPolicyText}</a>
        </div>`
                : ""
        }
    </div>`;

    if (!hasApp) {
        document.body.appendChild(app);
    }

    appEventSetup(app, settings);

    setTimeout(function() {
        app.classList.add("loaded");
    }, settings.delay);
};
const loadCorner = function(settings = {}) {
    const {
        useCorner = false,
        events: { onCornerClicked, onCornerLoad } = {}
    } = settings;

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

const initiate = function(params = {}) {
    const settings = {
        ...defaultParams,
        ...params,
        structure: {
            ...defaultParams.structure,
            ...(params.structure || {})
        },
        content: {
            ...defaultParams.content,
            ...(params.content || {})
        }
    };
    const { structure = {}, cookieName, points = [] } = settings;
    app = document.getElementById(structure.appId);

    const hasCookie = getCookie(cookieName);

    if (!hasCookie) {
        loadApp(settings);
    } else {
        closeApp(settings, true);
        loadCorner(settings);
    }

    const getSettings = () => {
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
        open: () => {
            return loadApp(settings);
        },
        close: () => {
            return closeApp(settings);
        },
        getSettings,
        // Save the new settings.
        saveSettings: (selectedPoints = []) => {
            return saveCookiePoints(points, selectedPoints, settings);
        },
        // Save specific setting
        saveSetting: (pointKey, isChecked = false) => {
            const selectedKeys = points.filter(point => point.key);
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

export default initiate;
