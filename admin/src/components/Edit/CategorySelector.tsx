import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
	Box,
	Typography,
	Combobox,
	ComboboxOption,
	Field,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../../utils/getTranslation';
import { DashboardCategory } from '../../../../typings';

interface CategorySelectorProps {
	categories: DashboardCategory[];
	selectedCategoryId: number | null;
	onSelectedCategoryIdChanged: (categoryId: number) => void,
}

const CategorySelector = ({ categories, selectedCategoryId, onSelectedCategoryIdChanged }: CategorySelectorProps) => {
	const categoriesWithLabel = categories.filter(x => !!x.label);
	const { formatMessage } = useIntl();

	return (<Box paddingBottom={2} style={{ width: 'fit-content' }}>
		<Field.Root name="field_selected-category">
			<Field.Label>
				<Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
					{formatMessage({ id: getTrad('plugin.settings.selected-category') })}
				</Typography>
			</Field.Label>
			<Combobox
				onChange={(e: number) => onSelectedCategoryIdChanged(e)}
				placeholder="Selected Category"
				value={selectedCategoryId}
			>
				{categoriesWithLabel.map((category) => (
					<ComboboxOption value={category.id} key={category.id}>
						{category.label}
					</ComboboxOption>
				))}
			</Combobox>
			<Field.Hint />
		</Field.Root>
	</Box>);
}

export default CategorySelector;

