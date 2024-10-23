import type { Core } from '@strapi/strapi';
import { DashboardIframe, DashboardCategory, DashboardItem, PluginSettingsResponse } from '../../../typings';

const getPluginStore = () => {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'custom-dashboard',
    });
};

const createDefaultConfig = async () => {
    const pluginStore = getPluginStore();

    const categoryList: Array<DashboardCategory> = [
        {
            id: 1,
            label: 'Database Content',
            order: 1,
            icon: 'Database',
            hint: 'Manage Database Content',
        },
        {
            id: 2,
            label: 'Settings',
            order: 2,
            icon: 'Cog',
            hint: 'Manage Website Settings',
        }
    ];

    const itemList: Array<DashboardItem> = [
        {
            id: 1,
            order: 1,
            label: 'Articles',
            hint: 'Edit Articles',
            category: 1,
            icon: 'List',
            collectionType: 'collectionType',
            entityId: 'api::article.article',
        },
        {
            id: 2,
            order: 2,
            label: 'Authors',
            hint: 'Edit Authors',
            category: 1,
            icon: 'User',
            collectionType: 'collectionType',
            entityId: 'api::author.author',
        },
        {
            id: 3,
            order: 3,
            label: 'Categories',
            hint: 'Edit Categories',
            category: 1,
            icon: 'Folder',
            collectionType: 'collectionType',
            entityId: 'api::category.category',
        },
        {
            id: 4,
            order: 4,
            label: 'Labels',
            hint: 'Edit Labels',
            category: 1,
            icon: 'PriceTag',
            collectionType: 'collectionType',
            entityId: 'api::label.label',
        },
        {
            id: 5,
            order: 5,
            label: 'Podcasts',
            hint: 'Edit Podcasts',
            category: 1,
            icon: 'Microphone',
            collectionType: 'collectionType',
            entityId: 'api::podcast.podcast',
        },
        {
            id: 6,
            order: 6,
            label: 'Subscriptions',
            hint: 'Edit Subscriptions',
            category: 1,
            icon: 'ListPlus',
            collectionType: 'collectionType',
            entityId: 'api::subscription.subscription',
        },
        {
            id: 7,
            order: 1,
            label: 'Configuration',
            hint: 'Edit Configuration',
            category: 2,
            icon: 'Cog',
            collectionType: 'singleType',
            entityId: 'api::configuration.configuration',
        },
        {
            id: 8,
            order: 2,
            label: 'Highlight Settings',
            hint: 'Edit Highlight Settings',
            category: 2,
            icon: 'Lightning',
            collectionType: 'singleType',
            entityId: 'api::highlight-setting.highlight-setting',
        },
        {
            id: 9,
            order: 3,
            label: 'Imprint',
            hint: 'Edit Imprint',
            category: 2,
            icon: 'Information',
            collectionType: 'singleType',
            entityId: 'api::imprint.imprint',
        }
    ];

    const iframeList: Array<DashboardIframe> = [
        {
            id: 1,
            order: 1,
            label: 'Analytics',
            hint: 'View Analytics',
            icon: 'ChartPie',
            url: 'https://plausible.io/share/ohlasy.info?auth=-aOd5Bi-4jyxpKQMlPrtI&embed=true&theme=dark',
            width: '100%',
            height: '500px',
            resize: true,
        },
        {
            id: 2,
            order: 2,
            label: 'A nice video',
            hint: 'View a nice video',
            icon: 'ChartBubble',
            url: 'http://www.youtube.com/embed/xDMP3i36naA',
            width: '100%',
            height: '600px',
            resize: false,
        },
    ];

    const value: PluginSettingsResponse = {
        title: 'Welcome to Custom Dashboard',
        subTitle: 'Adjust Database Content and Display Settings here',
        categories: categoryList,
        items: itemList,
        iframes: iframeList,
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

    async count(uid: string) {
        return await strapi.db.query(uid).count();
    },

    async getSettings(dashboard: string) {
        const pluginStore = getPluginStore();

        let config = await pluginStore.get({ key: 'settings' });
        if (!config) {
            config = await createDefaultConfig();
        }
        if (dashboard && dashboard.toLowerCase() === "dashboard") {
            const response = config as PluginSettingsResponse;

            for await (const item of response.items) {
                const contentType = strapi.contentType(item.entityId as any);
                if (contentType)
                    item.count = await this.count(item.entityId)
            }
        }
        return config;
    },

    async setSettings(settings) {
        const value = settings;
        const pluginStore = getPluginStore();

        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    },

});