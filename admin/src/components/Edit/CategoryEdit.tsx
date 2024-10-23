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
import { DashboardCategory, CategoryIcon, TCategoryIcon } from "../../../../typings";
import SettingsCardTextField from "./SettingsCardTextField";
import { useIntl } from "react-intl";
import { getTranslation as getTrad } from '../../utils/getTranslation';
import iconConverter from '../../utils/iconConverter';
import getDragStyles from "../../utils/getDragStyles";

type CategoryEditProps = {
	item: DashboardCategory;
	index: number;
	isOpacityEnabled?: boolean;
	isDragging?: boolean;
	onRemoveCard: (index: number) => void;
	updateItem: (index: number, fieldName: string, value: string) => void;
	updateIconChange: (index: number, value?: TCategoryIcon) => void,
} & HTMLAttributes<HTMLDivElement>

const CategoryEdit = forwardRef<HTMLDivElement, CategoryEditProps>(
	({ item, isOpacityEnabled, isDragging, style, index, updateItem, updateIconChange, onRemoveCard, ...props }, ref) => {
		const styles = getDragStyles(isDragging, isOpacityEnabled, style)
		const { formatMessage } = useIntl();

		item.label = ellipsis(item.label ?? "", 30);

		const categoryIcons = Object.values(CategoryIcon);

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
											fieldName="label" displayName="category.label" placeholder='Name'
											required={true} updateItem={updateItem} value={item.label} />
									</Box>
								</Grid.Item>
								<Grid.Item col={6} s={12}>
									<Box paddingBottom={6}>
										<Field.Root name="field_category_icon">
											<Field.Label>
												{formatMessage({ id: getTrad('plugin.settings.category.icon.label') })}
											</Field.Label>
											<Combobox
												onClear={() => updateIconChange(index, undefined)}
												onChange={(e: TCategoryIcon) => updateIconChange(index, e)}
												placeholder="Icon"
												value={item.icon}
											>
												{categoryIcons.map((key) => (
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
								<Grid.Item col={6} s={12}>
									<Box padding={2}>
										<SettingsCardTextField index={index} hasTooltip={true}
											fieldName="hint" displayName="category.hint" placeholder='Hint'
											required={false} updateItem={updateItem} value={item.hint} />
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

export default CategoryEdit;