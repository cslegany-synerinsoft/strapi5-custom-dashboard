import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({

    async getSettings(ctx) {
        const dashboard = ctx.params.dashboard;
        const settingService = strapi.plugin("custom-dashboard").service("settings");

        try {
            ctx.body = await settingService.getSettings(dashboard);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },

    async setSettings(ctx) {
        const settingService = strapi.plugin("custom-dashboard").service("settings");
        const { body } = ctx.request;

        try {
            await settingService.setSettings(body.body);
            ctx.body = await settingService.getSettings();
        }
        catch (err) {
            ctx.throw(500, err);
        }
    }

});