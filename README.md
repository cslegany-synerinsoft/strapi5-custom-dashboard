# strapi5-custom-dashboard
> This package adds a fully customizable Dashboard to replace the default one.

## Installation

NPM:

> `npm install @cslegany/custom-dashboard-strapi5`

Yarn:

> `yarn add @cslegany/custom-dashboard-strapi5`

## Usage
- Install and configure the plugin. Each category is identified by a label, and can have an icon and a hint message. Create as many categories as you wish.
- Create items in the selected category. An item is identified by a label, and can have an icon and a hint message. It can either be of collection or single type.
- DB entity ID of the item follows strapi patterns (i.e. api::article.article)
- A separate list of iframes can also be added. Each iframe is identified by a label, and can have an icon and a hint message. 
You can set a width and height value and can use iframe-resizer to get rid of the vertical scrollbar so famous for the '90s.
- Use the drag-and-drop feature to reorder categories, items of iframes.
- The UI of the plugin is accessible via the Menu link.

## Iframes and middleware customization
- In order to allow for example youtube.com and https://plausible.io to get loaded in an iframe, add the following code to config/middlewares.ts in your Strapi project:

```
export default [
  ...
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "frame-src": [
            "'self'",
            "*.youtube.com",
            "https://plausible.io",
          ],
        },
        upgradeInsecureRequests: null
      }
    }
  },
  { resolve: "./src/middlewares/custom-dashboard" },
];
```

You'll need an extra middleware to replace the built-in welcome screen with Custom Dashboard.
Add the following code to src/middlewares/custom-dashboard.ts :

```
import type * as strapi from '@strapi/strapi';

export default (config, { strapi }: { strapi: strapi.Core.Strapi }) => {
	strapi.server.routes([
		{
			method: 'GET',
			path: '/',
			handler(ctx) {
				ctx.redirect("/admin/plugins/custom-dashboard");
			},
			config: { auth: false },
		},
		{
			method: 'GET',
			path: '/admin',
			handler(ctx) {
				ctx.redirect("/admin/plugins/custom-dashboard");
			},
			config: { auth: false },
		},
		{
			method: 'GET',
			path: "/index.html",
			handler(ctx) {
				ctx.redirect("/admin/plugins/custom-dashboard");
			},
			config: { auth: false },
		},
	]);

	return async (context, next) => {
		strapi.log.info("In admin-redirect middleware.");
		await next();
	};
};
```

Note that this middleware rarely works well in develop mode but has been working in other environments.

If the custom middleware doesn't suit you, you can experiment with app.tsx redirects.
Install @types/dom-navigation
Rename src/admin/app.example.tsx to app.tsx and add the following code to bootstrap(app: StrapiApp) { }

```
bootstrap(app: StrapiApp) {
		const url = "/admin/plugins/custom-dashboard";

		if ("navigation" in window) {
			// Redirect soft /admin navigations to `url`
			// Chrome-only
			window.navigation.addEventListener("navigate", (e) => {
				const { pathname } = new URL(e.destination.url);

				if (new RegExp("^/admin/?$").test(pathname)) {
					window.navigation.navigate(url);
				}
			});
		}

		// Redirect hard /admin navigations to `url`
		if (new RegExp("^/admin/?$").test(location.pathname)) {
			location.href = url;
		}
	},
```

## License

MIT
