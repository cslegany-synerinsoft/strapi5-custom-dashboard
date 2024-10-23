import React from 'react';
import {
	Box,
	Flex,
	Typography,
	Grid,
	Button,
} from '@strapi/design-system';
import { DashboardItem } from '../../../../typings';
import iconConverter from '../../utils/iconConverter';
import TooltipIconButton from '../TooltipIconButton';

interface DashboardItemDisplayProps {
	item: DashboardItem;
	pluralCountMessage: string;
	singleCountMessage: string;
	handleClick: (item: DashboardItem) => void;
}

const DashboardItemDisplay = ({ item, handleClick, pluralCountMessage, singleCountMessage }: DashboardItemDisplayProps) => {

	const getCountLabel = (item: DashboardItem) => {
		if (!item.count)
			return;

		if (item.count === 1)
			return singleCountMessage;

		return pluralCountMessage.replace("${count}", item.count.toString());
	}

	return (
		<Grid.Item key={item.id} col={4} s={12}>
			<Box padding={2} background="neutral150" style={{ width: '100%' }}>

				<Flex justifyContent="space-between">
					<Box style={{ width: '100%' }}>
						<Flex direction="row">
							<Button variant="secondary" size="L" onClick={() => handleClick(item)}
								startIcon={item.icon && iconConverter(item.icon)}>
								{item.label}
							</Button>
							<Box marginLeft={2}>
								<Typography variant="pi">
									{item.hint}
								</Typography>
							</Box>
						</Flex>
					</Box>
					{item.collectionType === 'collectionType' && item.count && <Box marginLeft={2}>
						<TooltipIconButton label={getCountLabel(item)}
							showBorder={true} variant='tertiary'>
							<span>{item.count}</span>
						</TooltipIconButton>
					</Box>}
				</Flex>
			</Box>
		</Grid.Item>
	);
}

export default DashboardItemDisplay;