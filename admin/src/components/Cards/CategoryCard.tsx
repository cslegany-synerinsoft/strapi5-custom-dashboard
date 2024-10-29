import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
	Button,
	Flex,
	Box,
	Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../../utils/getTranslation';
import { DashboardCategory, TCategoryIcon } from '../../../../typings';
import SortableCard from '../SortCard/SortableCard';
import { SortEndParams } from '../SortCard/typings';
import { Plus } from '@strapi/icons';
import { arrayMove } from '@dnd-kit/sortable';
import { debounce } from 'lodash';

interface CategoryCardProps {
	categoryData: DashboardCategory[],
	notifyIsDataValid: (isValid: boolean) => void;
	notifyCategoryChanged: (data: DashboardCategory[]) => void
}

export interface CategoryCardRef {
	getData: () => DashboardCategory[];
}

const CategoryCard = forwardRef<CategoryCardRef | undefined, CategoryCardProps>((props: CategoryCardProps, ref) => {
	const { categoryData, notifyIsDataValid, notifyCategoryChanged } = props;
	const sortedCategories = categoryData.sort(x => x.order);
	const [categories, setCategories] = useState<DashboardCategory[]>(sortedCategories);

	const { formatMessage } = useIntl();

	useImperativeHandle(
		ref,
		() => {
			// the return object will pass to parent ref.current, so you can add anything what you want.
			return {
				getData: () => categories,
			}
		},
		[categories],
	);

	const checkIsDataValid = (updatedCategories: DashboardCategory[]) => {
		const hasError = updatedCategories.findIndex(x => !x.label) !== -1;
		return !hasError;
	}

	const onCategorySortEnd = async (params: SortEndParams) => {
		const { oldIndex, newIndex } = params;
		if (oldIndex !== newIndex) {
			let updatedCategories = categories.map(item => ({ ...item }));
			updatedCategories = arrayMove<DashboardCategory>(updatedCategories, oldIndex, newIndex);
			updatedCategories.forEach((x, index) => {
				x.order = index + 1;
			});
			setCategories(updatedCategories);
		}
	}

	const debouncedOnChange = debounce(notifyCategoryChanged, 500);

	const onAddCategory = () => {
		const category: DashboardCategory = {
			id: categories.length + 1, label: '', order: categories.length,
		};
		const updatedCategories = categories.map(item => ({ ...item }));
		updatedCategories.push(category);
		notifyIsDataValid(checkIsDataValid(updatedCategories));
		debouncedOnChange(updatedCategories);
		setCategories(updatedCategories);
	}

	const onRemoveCategory = (index: number) => {
		const updatedCategories = categories.filter((item, itemIndex) => itemIndex !== index);
		updatedCategories.forEach((x, index) => {
			x.order = index + 1;
		});
		notifyIsDataValid(checkIsDataValid(updatedCategories));
		debouncedOnChange(updatedCategories);
		setCategories(updatedCategories);
	}

	const onUpdateCategory = (index: number, fieldName: string, value: string | boolean) => {
		try {
			let updatedCategories = categories.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					(item as any)[fieldName] = value;
					return item;
				}
				return setting;
			});
			notifyIsDataValid(checkIsDataValid(updatedCategories));
			debouncedOnChange(updatedCategories);
			setCategories(updatedCategories);
		} catch (e) {
			console.log(e);
		}
	}

	const onUpdateCategoryIconChange = (index: number, value?: TCategoryIcon) => {
		try {
			let updatedCategories = categories.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					item.icon = value;
					return item;
				}
				return setting;
			});
			setCategories(updatedCategories);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<>
			<Box paddingBottom={4} paddingTop={4} style={{ width: '100%' }}>
				<Flex justifyContent="space-between">
					<Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
						{formatMessage({ id: getTrad("plugin.settings.manage-categories") })}
					</Typography>
					<Button variant="default" startIcon={<Plus />} onClick={onAddCategory}>
						{formatMessage({ id: getTrad("plugin.settings.buttons.add-category") })}
					</Button>
				</Flex>
			</Box>
			{categories.length > 0 && (
				<>
					<SortableCard type='category' data={categories} onSortEnd={onCategorySortEnd}
						updateItem={onUpdateCategory}
						updateIconChange={onUpdateCategoryIconChange as any}
						onRemoveCard={onRemoveCategory} />
				</>
			)}
		</>
	)
})

export default CategoryCard;