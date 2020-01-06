require("./CookieSettings.css");

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
        showDetail: "Show details",
        closeDetail: "Close details"
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
        onSubmit: null
    },
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
    const { points = [], cookieName, cookieDays } = settings;
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
            }
        });
    }

    const submitBtn = app.querySelector(
        '.cookie-settings__submit[type="button"]'
    );
    if (submitBtn) {
        submitBtn.addEventListener("click", event => {
            event.preventDefault();
            const selectedPoints = points.filter(point => point.value);
            const cookieValue =
                "|" + selectedPoints.map(point => point.key).join("|") + "|";
            setCookie(cookieName, cookieValue, cookieDays);
            app.classList.remove("loaded");
            if (settings.events.onSubmit) {
                settings.events.onSubmit(selectedPoints);
            }
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
            });
        }
    }

    const pointsSidebar = app.querySelectorAll(".point-sidebar li");
    if (pointsSidebar && pointsSidebar.length > 0) {
        for (let i = 0; i < pointsSidebar.length; i++) {
            if (i === 0) {
                activatePointSidebar(pointsSidebar[i], app);
            }
            pointsSidebar[i].addEventListener("click", event => {
                activatePointSidebar(event.currentTarget, app);
            });
        }
    }
};

const loadApp = (settings = {}) => {
    const app = document.createElement("div");
    const { structure = {}, content = {} } = settings;
    app.id = structure.appId;
    app.className = "cookie-settings";

    const pointHTML = settings.points
        .map(point => {
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
        .map((point, index) => {
            return `<li class="point-sidebar__item${
                point.value ? " checked" : ""
            }" data-target=".point-content--${index}">
            ${point.label}
        </li>`;
        })
        .join("");
    const pointDetailContents = settings.points
        .map((point, index) => {
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
            <div class="cookie-settings__actions-wrapper">
                <div class="cookie-settings__actions-inner">
                    ${pointHTML}
                </div>
                <button class="cookie-settings__action-details cookie-settings__action-details__open" type="button">${content.showDetail}</button>
                <button class="cookie-settings__action-details cookie-settings__action-details__close" type="button">${content.closeDetail}</button>
            </div>
            <button class="cookie-settings__submit" type="button">
                ${content.submit}
            </button>
        </div>
        <div class="cookie-settings__details-wrapper">
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
        </div>
    </div>`;

    document.body.appendChild(app);

    appEventSetup(app, settings);

    setTimeout(() => {
        app.classList.add("loaded");
    }, settings.delay);
};

const initiate = (params = {}) => {
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
    const { cookieName } = settings;

    const hasCookie = getCookie(cookieName);
    if (!hasCookie) {
        loadApp(settings);
    }
};

module.exports = initiate;
