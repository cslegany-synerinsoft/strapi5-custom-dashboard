import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
	Button,
	Flex,
	Box,
	Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../../utils/getTranslation';
import { DashboardItem, TCollectionType, TItemIcon } from '../../../../typings';
import SortableCard from '../SortCard/SortableCard';
import { SortEndParams } from '../SortCard/typings';
import { Plus } from '@strapi/icons';
import { arrayMove } from '@dnd-kit/sortable';

interface ItemCardProps {
	selectedCategoryId: number | null;
	itemData: DashboardItem[],
	notifyIsDataValid: (isValid: boolean) => void;
}

export interface ItemCardRef {
	getData: () => DashboardItem[];
}

const ItemCard = forwardRef<ItemCardRef | undefined, ItemCardProps>((props: ItemCardProps, ref) => {
	const { selectedCategoryId, itemData, notifyIsDataValid } = props;
	const [categoryItems, setCategoryItems] = useState<DashboardItem[]>([]);

	useEffect(() => {
		const sortedItems = itemData.sort(x => x.order);
		setCategoryItems(sortedItems);
	}, [selectedCategoryId])

	const { formatMessage } = useIntl();

	useImperativeHandle(
		ref,
		() => {
			// the return object will pass to parent ref.current, so you can add anything what you want.
			return {
				getData: () => categoryItems,
			}
		},
		[categoryItems],
	);

	const checkIsDataValid = (updatedItems: DashboardItem[]) => {
		const hasError = updatedItems.findIndex(x => !x.label || !x.category || !x.collectionType || !x.entityId) !== -1;
		return !hasError;
	}

	const onItemSortEnd = async (params: SortEndParams) => {
		const { oldIndex, newIndex } = params;
		if (oldIndex !== newIndex) {
			let updatedCategoryItems = categoryItems.map(item => ({ ...item }));
			updatedCategoryItems = arrayMove<DashboardItem>(updatedCategoryItems, oldIndex, newIndex);
			updatedCategoryItems.forEach((x, index) => {
				x.order = index + 1;
			});
			setCategoryItems(updatedCategoryItems);
		}
	}

	const onAddItem = () => {
		if (!selectedCategoryId)
			return;

		const item: DashboardItem = {
			id: itemData.length + 1, label: '', order: categoryItems.length,
			category: selectedCategoryId, collectionType: 'collectionType', entityId: '', hint: '',
		};
		const updatedCategoryItems = categoryItems.map(item => ({ ...item }));
		updatedCategoryItems.push(item);
		notifyIsDataValid(checkIsDataValid(updatedCategoryItems));
		setCategoryItems(updatedCategoryItems);
	}

	const onRemoveItem = (index: number) => {
		const newItems = categoryItems.filter((item, itemIndex) => itemIndex !== index);
		notifyIsDataValid(checkIsDataValid(newItems));
		setCategoryItems(newItems);
	}

	const onUpdateItem = (index: number, fieldName: string, value: string) => {
		try {
			let updatedItems = categoryItems.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					(item as any)[fieldName] = value;
					return item;
				}
				return setting;
			});
			notifyIsDataValid(checkIsDataValid(updatedItems));
			setCategoryItems(updatedItems);
		} catch (e) {
			console.log(e);
		}
	}

	const onUpdateItemIconChange = (index: number, value?: TItemIcon) => {
		try {
			let updatedItems = categoryItems.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					item.icon = value;
					return item;
				}
				return setting;
			});
			setCategoryItems(updatedItems);
		} catch (e) {
			console.log(e);
		}
	}

	const onUpdateCollectionTypeChange = (index: number, value: TCollectionType) => {
		try {
			let updatedItems = categoryItems.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					item.collectionType = value;
					return item;
				}
				return setting;
			});
			setCategoryItems(updatedItems);
		} catch (e) {
			console.log(e);
		}
	}

	return (<>
		<Box paddingBottom={4} paddingTop={2} style={{ width: '100%' }}>
			<Flex justifyContent="space-between">
				<Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
					{formatMessage({ id: getTrad("plugin.settings.manage-items") })}
				</Typography>
				<Button variant="default" startIcon={<Plus />} onClick={onAddItem}>
					{formatMessage({ id: getTrad("plugin.settings.buttons.add-item") })}
				</Button>
			</Flex>
		</Box>
		{categoryItems.length > 0 && (
			<>
				<SortableCard type='item' data={categoryItems} onSortEnd={onItemSortEnd}
					updateItem={onUpdateItem}
					updateIconChange={onUpdateItemIconChange}
					updateCollectionTypeChange={onUpdateCollectionTypeChange}
					onRemoveCard={onRemoveItem} />
			</>
		)}
	</>);
})

export default ItemCard;