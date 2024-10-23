import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { HTMLAttributes } from "react"
import CategoryEdit from "../Edit/CategoryEdit"
import ItemEdit from "../Edit/ItemEdit"
import IframeEdit from "../Edit/IframeEdit"
import { DashboardCategory, DashboardIframe, DashboardItem, TCategoryIcon, TCollectionType, TItemIcon } from "../../../../typings"
import { TSortableItem } from "./typings"

type SortableCardItemProps = {
	item: DashboardCategory | DashboardItem | DashboardIframe;
	index: number;
	type: TSortableItem;
	onRemoveCard: (index: number) => void;
	updateItem: (index: number, fieldName: string, value: string | boolean) => void;
	updateIconChange: (index: number, value?: TCategoryIcon | TItemIcon) => void,
	updateCollectionTypeChange?: (index: number, value: TCollectionType) => void,
} & HTMLAttributes<HTMLDivElement>

const SortableCardItem = (props: SortableCardItemProps) => {
	const { item, type } = props;
	const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
		id: item.id,
	})

	const styles = {
		transform: CSS.Transform.toString(transform),
		transition: transition || undefined,
	}

	const getDisplayComponent = () => {
		switch (type) {
			case "category":
				return <CategoryEdit
					ref={setNodeRef}
					style={styles}
					isOpacityEnabled={isDragging}
					{...props}
					{...attributes}
					{...listeners}
					item={item as DashboardCategory}
				/>;
			case "item":
				return <ItemEdit
					ref={setNodeRef}
					style={styles}
					isOpacityEnabled={isDragging}
					{...props}
					{...attributes}
					{...listeners}
					item={item as DashboardItem}
				/>;
			case "iframe":
				return <IframeEdit
					ref={setNodeRef}
					style={styles}
					isOpacityEnabled={isDragging}
					{...props}
					{...attributes}
					{...listeners}
					item={item as DashboardIframe}
				/>;
			default:
				break;
		}
		return <></>;
	}
	return getDisplayComponent();
}

export default SortableCardItem;