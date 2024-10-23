import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	Box,
	Divider,
} from '@strapi/design-system';
import { Page, Layouts, useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../utils/getTranslation';
import { DashboardCategory, DashboardItem, PluginSettingsResponse } from '../../../typings';
import SettingsTextField from '../components/Edit/SettingsTextField';
import IframeCard, { IframeCardRef } from '../components/Cards/IframeCard';
import CategoryCard, { CategoryCardRef } from '../components/Cards/CategoryCard';
import ItemCard, { ItemCardRef } from '../components/Cards/ItemCard';
import CategorySelector from '../components/Edit/CategorySelector';

const SettingsPage = () => {
	const isMounted = useRef(true);
	const { formatMessage } = useIntl();
	const { toggleNotification } = useNotification();
	const { get, post } = useFetchClient();

	const categoryPageRef = useRef<CategoryCardRef>();
	const itemPageRef = useRef<ItemCardRef>();
	const iframePageRef = useRef<IframeCardRef>();

	const [isSaving, setIsSaving] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

	const defaultSettingsBody: PluginSettingsResponse | null = null;
	const [settings, setSettings] = useState<PluginSettingsResponse | null>(defaultSettingsBody);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await get<PluginSettingsResponse>(`/custom-dashboard/settings`);
			setSettings(data);
			setIsLoading(false);
		}
		fetchData();

		// unmount
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (settings && settings.categories.length > 0) {
			const sortedCategories = settings.categories.sort(x => x.order);
			settings.categories = sortedCategories;
			setSelectedCategoryId(settings.categories[0].id);
		}
	}, [settings]);

	const [isCategoryValid, setIsCategoryValid] = useState<boolean>(true);
	const [isItemValid, setIsItemValid] = useState<boolean>(true);
	const [isIframeValid, setIsIframeValid] = useState<boolean>(true);

	const categories = settings?.categories ?? [];
	const items = settings?.items.filter(x => x.category === selectedCategoryId) ?? [];
	const iframes = settings?.iframes ?? [];

	const onIframeValidChanged = (isValid: boolean) => {
		setIsIframeValid(isValid);
	}

	const onCategoryValidChanged = (isValid: boolean) => {
		setIsCategoryValid(isValid);
	}

	const onItemValidChanged = (isValid: boolean) => {
		setIsItemValid(isValid);
	}

	const onCategoryChanged = (data: DashboardCategory[]) => {
		if (!settings)
			return;

		const updatedSettings = { ...settings };
		updatedSettings.categories = data;
		setSettings(updatedSettings);
	}

	const getNonCategoryItems = (categoryId: number) => {
		const nonCategoryItems = settings?.items.filter(x => x.category !== categoryId);
		let res: DashboardItem[] = [];
		res.push(...nonCategoryItems ?? []);
		return res;
	}

	const getAllItems = () => {
		if (!selectedCategoryId) {
			return settings?.items ?? [];
		}

		const nonCategoryItems = getNonCategoryItems(selectedCategoryId);
		const updatedCategoryItems = itemPageRef.current?.getData() ?? [];
		return [...nonCategoryItems, ...updatedCategoryItems];
	}

	const onSelectedCategoryIdChanged = (categoryId: number) => {
		if (!settings)
			return;

		const allItems = getAllItems();
		settings.items = allItems;
		setSelectedCategoryId(categoryId);
	}

	const onUpdateSettings = (fieldName: string, value: string) => {
		if (!settings)
			return;

		try {
			const updatedSettings = { ...settings };
			(updatedSettings as any)[fieldName] = value;
			setSettings(updatedSettings);
		} catch (e) {
			console.log(e);
		}
	}

	const onSubmit = async () => {
		if (isSaving)
			return;

		const settingsData = settings ?? { categories: [], iframes: [], items: [], title: "" };
		settingsData.categories = categoryPageRef.current?.getData() ?? [];
		settingsData.iframes = iframePageRef.current?.getData() ?? [];
		settingsData.items = getAllItems();
		setIsSaving(true);

		const res = await post(`/custom-dashboard/settings`, {
			method: 'POST',
			body: settingsData
		});
		setSettings(res.data);
		setIsSaving(false);

		toggleNotification({
			type: 'success',
			message: formatMessage({
				id: 'plugin.settings.updated',
				defaultMessage: 'Settings successfully updated',
			}),
		});
	};

	return (
		<>
			<Layouts.Header
				id="title"
				title={formatMessage({ id: getTrad("plugin.settings.info.title") })}
				subtitle={formatMessage({ id: getTrad("plugin.settings.info.subtitle") })}
				primaryAction={
					isLoading ? (<></>) : (
						<Button
							onClick={onSubmit}
							startIcon={<Check />}
							size="L"
							disabled={isSaving || !isCategoryValid || !isItemValid || !isIframeValid}
							loading={isSaving}
						>
							{formatMessage({ id: getTrad("plugin.settings.buttons.save") })}
						</Button>
					)
				}
			>
			</Layouts.Header>
			<Layouts.Content>
				{(isLoading || !settings) ? (
					<Page.Loading />
				) : (
					<>
						{/* title and subtitle */}
						<Box paddingBottom={4}>
							<SettingsTextField hasTooltip={true}
								fieldName="title" displayName="page.title" placeholder='Page Title'
								required={false} updateItem={onUpdateSettings} value={settings?.title} />
						</Box>
						<Box paddingBottom={4}>
							<SettingsTextField hasTooltip={true}
								fieldName="subTitle" displayName="page.subTitle" placeholder='Page Subtitle'
								required={false} updateItem={onUpdateSettings} value={settings?.subTitle} />
						</Box>

						{/* categories */}
						<CategoryCard categoryData={categories} ref={categoryPageRef}
							notifyIsDataValid={onCategoryValidChanged}
							notifyCategoryChanged={onCategoryChanged}
						/>
						{categories.length > 0 && (
							<>
								<Box padding={2}>
									<Divider margin={0} />
								</Box>

								{/* category selector dropdown */}
								<CategorySelector categories={categories} selectedCategoryId={selectedCategoryId}
									onSelectedCategoryIdChanged={onSelectedCategoryIdChanged} />

								{/* category items */}
								<ItemCard itemData={items} ref={itemPageRef} selectedCategoryId={selectedCategoryId}
									notifyIsDataValid={onItemValidChanged} />
							</>
						)}

						{/* iframes */}
						<Box padding={2}>
							<Divider margin={0} />
						</Box>
						<IframeCard iframeData={iframes} ref={iframePageRef}
							notifyIsDataValid={onIframeValidChanged} />
					</>
				)}
			</Layouts.Content >
		</>
	);
}

export default SettingsPage;