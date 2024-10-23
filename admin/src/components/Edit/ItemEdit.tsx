import {
	Box,
	Grid,
	Typography,
	Field,
	Flex,
	Card,
	CardHeader,
	CardBody,
	CardContent,
	CardBadge,
	Combobox,
	ComboboxOption,
	IconButton,
} from "@strapi/design-system";
import { Drag, Trash } from "@strapi/icons";
import { forwardRef, HTMLAttributes } from "react"
import ellipsis from "../../utils/ellipsis";
import { CollectionType, DashboardItem, ItemIcon, TCollectionType, TItemIcon } from "../../../../typings";
import SettingsCardTextField from "./SettingsCardTextField";
import { useIntl } from "react-intl";
import { getTranslation as getTrad } from '../../utils/getTranslation';
import iconConverter from '../../utils/iconConverter';
import getDragStyles from "../../utils/getDragStyles";

type ItemEditProps = {
	item: DashboardItem;
	index: number;
	isOpacityEnabled?: boolean;
	isDragging?: boolean;
	onRemoveCard: (index: number) => void;
	updateItem: (index: number, fieldName: string, value: string) => void;
	updateIconChange: (index: number, value?: TItemIcon) => void,
	updateCollectionTypeChange?: (index: number, value: TCollectionType) => void,
} & HTMLAttributes<HTMLDivElement>

const ItemEdit = forwardRef<HTMLDivElement, ItemEditProps>(
	({ item, isOpacityEnabled, isDragging, style, index,
		updateItem, updateIconChange, updateCollectionTypeChange, onRemoveCard, ...props }, ref) => {
		const styles = getDragStyles(isDragging, isOpacityEnabled, style)
		const { formatMessage } = useIntl();

		item.label = ellipsis(item.label ?? "", 30);

		const itemIcons = Object.values(ItemIcon);
		const collectionTypes = Object.values(CollectionType);

		return (
			<Box ref={ref} paddingBottom={4} style={styles} {...props}>
				<Card style={{
					width: '520px'
				}}>
					<CardHeader>
						<Box paddingBottom={2} paddingTop={2} width={'100%'}>
							<Flex justifyContent="space-between">
								<Flex>
									<Drag />
									<Typography>
										<CardBadge>{item.label}</CardBadge>
									</Typography>
								</Flex>
								<Box paddingRight={1}>
									<IconButton withTooltip={false} variant="secondary" onClick={() => onRemoveCard(index)}>
										<Trash />
									</IconButton>
								</Box>
							</Flex>
						</Box>

					</CardHeader>
					<CardBody>
						<CardContent>
							<Grid.Root gap={6}>
								<Grid.Item col={6} s={12}>
									<Box padding={2}>
										<SettingsCardTextField index={index} hasTooltip={true}
											fieldName="label" displayName="item.label" placeholder='Name'
											required={true} updateItem={updateItem} value={item.label} />
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box padding={2}>
										<SettingsCardTextField index={index} hasTooltip={true}
											fieldName="hint" displayName="item.hint" placeholder='Hint'
											required={true} updateItem={updateItem} value={item.hint} />
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box padding={2}>
										<Field.Root name="field_item_collectionType">
											<Field.Label>
												{formatMessage({ id: getTrad('plugin.settings.item.collectionType.label') })}
											</Field.Label>
											<Combobox
												onChange={(e: TCollectionType) => updateCollectionTypeChange && updateCollectionTypeChange(index, e)}
												placeholder="Collection Type"
												value={item.collectionType}
											>
												{collectionTypes.map((key) => (
													<ComboboxOption value={key} key={key}>
														{key}
													</ComboboxOption>
												))}
											</Combobox>
											<Field.Hint />
										</Field.Root>
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box padding={2}>
										<Field.Root name="field_item_icon">
											<Field.Label>
												{formatMessage({ id: getTrad('plugin.settings.item.icon.label') })}
											</Field.Label>
											<Combobox
												onClear={() => updateIconChange(index, undefined)}
												onChange={(e: TItemIcon) => updateIconChange(index, e)}
												placeholder="Icon"
												value={item.icon}
											>
												{itemIcons.map((key) => (
													<ComboboxOption value={key} key={key}>
														<Flex>
															{iconConverter(key)}
															<Box paddingLeft={2}>
																{key}
															</Box>
														</Flex>
													</ComboboxOption>
												))}
											</Combobox>
											<Field.Hint />
										</Field.Root>
									</Box>
								</Grid.Item>
								<Grid.Item col={12} s={12} >
									<Box padding={2} style={{width: '100%'}}>
										<SettingsCardTextField index={index} hasTooltip={true} 
											fieldName="entityId" displayName="item.entityId" placeholder='EntityId'
											required={true} updateItem={updateItem} value={item.entityId} />
									</Box>
								</Grid.Item>
							</Grid.Root>
						</CardContent>
					</CardBody>
				</Card>
			</Box>
		)
	}
)

export default ItemEdit;