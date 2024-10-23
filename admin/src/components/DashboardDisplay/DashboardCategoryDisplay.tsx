import React from 'react';
import {
	Box,
	Flex,
	Typography,
	Grid,
} from '@strapi/design-system';
import { DashboardCategory, DashboardItem } from '../../../../typings';
import iconConverter from '../../utils/iconConverter';
import DashboardItemDisplay from './DashboardItemDisplay';

interface DashboardCategoryDisplayProps {
	category: DashboardCategory;
	pluralCountMessage: string;
	singleCountMessage: string;
	categoryItems: Map<number, DashboardItem[]> | null;
	handleClick: (item: DashboardItem) => void;
}

const DashboardCategoryDisplay = (props: DashboardCategoryDisplayProps) => {
	const { category, categoryItems, pluralCountMessage, singleCountMessage, handleClick } = props;

	const getItemsInCategory = (categoryId: number) => {
		if (!categoryItems?.has(categoryId))
			return [];

		const value = categoryItems.get(categoryId);
		if (!value)
			return [];
		const sortedItems = value.sort(x => x.order);
		return sortedItems;
	}

	const renderItems = (categoryId: number) => {
		const items = getItemsInCategory(categoryId);

		if (items.length > 0) {
			return (
				<Grid.Root gap={4}>
					{items.map((item) => (
						<DashboardItemDisplay key={item.id} item={item} handleClick={handleClick}
							pluralCountMessage={pluralCountMessage} singleCountMessage={singleCountMessage} />
					))}
				</Grid.Root>
			);
		}
		return <></>;
	}

	return (
		<Box key={category.id} paddingBottom={4}>
			<Box background="neutral0" hasRadius={true} shadow="filterShadow">
				<Flex justifyContent="center" padding={4}>
					<Box paddingRight={2} paddingTop={1}>
						{category.icon && iconConverter(category.icon)}
					</Box>
					<Typography variant="beta">{category.label}</Typography>
				</Flex>
				{category.hint && (
					<Box paddingBottom={2}>
						<Flex justifyContent="center">
							<Typography variant="pi">
								{category.hint}
							</Typography>
						</Flex>
					</Box>
				)}
				<Box padding={2}>
					{renderItems(category.id)}
				</Box>
			</Box>
		</Box>
	);
}

export default DashboardCategoryDisplay;