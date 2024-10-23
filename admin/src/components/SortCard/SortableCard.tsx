import React, { useState } from 'react';
import {
	Box,
	Grid,
} from '@strapi/design-system';
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
	TouchSensor,
	closestCenter,
	MouseSensor
} from "@dnd-kit/core"
import {
	SortableContext,
} from "@dnd-kit/sortable"
import SortableCardItem from './SortableCardItem';
import { SortEndParams, TSortableItem } from './typings';
import { DashboardCategory, DashboardIframe, DashboardItem, TCategoryIcon, TCollectionType, TItemIcon } from '../../../../typings';

interface SortableCardProps {
	data: DashboardCategory[] | DashboardItem[] | DashboardIframe[];
	type: TSortableItem;
	onRemoveCard: (index: number) => void;
	updateItem: (index: number, fieldName: string, value: string | boolean) => void;
	updateIconChange: (index: number, value?: TCategoryIcon | TItemIcon) => void,
	updateCollectionTypeChange?: (index: number, value: TCollectionType) => void,
	onSortEnd: (params: SortEndParams) => void;
}
const SortableCard = (props: SortableCardProps) => {
	const { data, type, onRemoveCard, updateItem, updateIconChange, updateCollectionTypeChange, onSortEnd } = props;

	// for drag overlay
	const [activeItem, setActiveItem] = useState<DashboardCategory | DashboardItem | DashboardIframe>();

	// for input methods detection
	// https://stackoverflow.com/questions/77415442/listeners-from-dnd-kit-are-interfering-with-the-inputcheckboxs-onchange-event
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 50,
				tolerance: 6,
			},
		}),
	);

	// triggered when dragging starts
	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveItem(data.find((item) => item.id === active.id));
	}

	// triggered when dragging ends
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeItem = data.find((item) => item.id === active.id);
		const overItem = data.find((item) => item.id === over.id);

		if (!activeItem || !overItem) {
			return;
		}

		const activeIndex = data.findIndex((item) => item.id === active.id);
		const overIndex = data.findIndex((item) => item.id === over.id);

		setActiveItem(undefined);
		onSortEnd({ oldIndex: activeIndex, newIndex: overIndex });
	}

	const handleDragCancel = () => {
		setActiveItem(undefined);
	}

	return (
		<Box style={{ width: '100%' }}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
			>
				<SortableContext items={data}>
					<Grid.Root gap={6}>
						{data.map((item, index) => (
							<Grid.Item key={item.id} col={6} s={12}>
								<SortableCardItem item={item} index={index} type={type}
									updateItem={updateItem}
									updateIconChange={updateIconChange}
									updateCollectionTypeChange={updateCollectionTypeChange}
									onRemoveCard={onRemoveCard} />
							</Grid.Item>
						))}
					</Grid.Root>
				</SortableContext>
			</DndContext>
		</Box>
	);
}

export default SortableCard;
