import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
	Button,
	Flex,
	Box,
	Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../../utils/getTranslation';
import { DashboardIframe, TItemIcon } from '../../../../typings';
import SortableCard from '../SortCard/SortableCard';
import { SortEndParams } from '../SortCard/typings';
import { Plus } from '@strapi/icons';
import { arrayMove } from '@dnd-kit/sortable';

interface IframeCardProps {
	iframeData: DashboardIframe[],
	notifyIsDataValid: (isValid: boolean) => void;
}

export interface IframeCardRef {
	getData: () => DashboardIframe[];
}

const IframeCard = forwardRef<IframeCardRef | undefined, IframeCardProps>((props: IframeCardProps, ref) => {
	const { iframeData, notifyIsDataValid } = props;
	const sortedIframes = iframeData.sort(x => x.order);
	const [iframes, setIframes] = useState<DashboardIframe[]>(sortedIframes);

	const { formatMessage } = useIntl();

	useImperativeHandle(
		ref,
		() => {
			// the return object will pass to parent ref.current, so you can add anything what you want.
			return {
				getData: () => iframes,
			}
		},
		[iframes],
	);

	const checkIsDataValid = (updatedIframes: DashboardIframe[]) => {
		const hasError = updatedIframes.findIndex(x => !x.label || !x.url) !== -1;
		return !hasError;
	}

	const onIframeSortEnd = async (params: SortEndParams) => {
		const { oldIndex, newIndex } = params;
		if (oldIndex !== newIndex) {
			let updatedIframes = iframes.map(item => ({ ...item }));
			updatedIframes = arrayMove<DashboardIframe>(updatedIframes, oldIndex, newIndex);
			updatedIframes.forEach((x, index) => {
				x.order = index + 1;
			});
			setIframes(updatedIframes);
		}
	}

	const onAddIframe = () => {
		const iframe: DashboardIframe = {
			id: iframes.length + 1, label: '', order: iframes.length, url: '', resize: true,
		};
		const updatedIframes = iframes.map(item => ({ ...item }));
		updatedIframes.push(iframe);
		notifyIsDataValid(checkIsDataValid(updatedIframes));
		setIframes(updatedIframes);
	}

	const onRemoveIframe = (index: number) => {
		const udatedIframes = iframes.filter((item, itemIndex) => itemIndex !== index);
		udatedIframes.forEach((x, index) => {
			x.order = index + 1;
		});
		notifyIsDataValid(checkIsDataValid(udatedIframes));
		setIframes(udatedIframes);
	}

	const onUpdateIframe = (index: number, fieldName: string, value: string | boolean) => {
		try {
			let updatedIframes = iframes.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					(item as any)[fieldName] = value;
					return item;
				}
				return setting;
			});
			notifyIsDataValid(checkIsDataValid(updatedIframes));
			setIframes(updatedIframes);
		} catch (e) {
			console.log(e);
		}
	}

	const onUpdateIframeIconChange = (index: number, value?: TItemIcon) => {
		try {
			let updatedIframes = iframes.map((setting, settingIndex) => {
				if (settingIndex === index) {
					const item = { ...setting };
					item.icon = value;
					return item;
				}
				return setting;
			});
			setIframes(updatedIframes);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<>
			<Box paddingBottom={4} paddingTop={4} style={{ width: '100%' }}>
				<Flex justifyContent="space-between">
					<Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
						{formatMessage({ id: getTrad("plugin.settings.manage-iframes") })}
					</Typography>
					<Button variant="default" startIcon={<Plus />} onClick={onAddIframe}>
						{formatMessage({ id: getTrad("plugin.settings.buttons.add-iframe") })}
					</Button>
				</Flex>
			</Box>
			{iframes.length > 0 && (
				<>
					<SortableCard type='iframe' data={iframes} onSortEnd={onIframeSortEnd}
						updateItem={onUpdateIframe}
						updateIconChange={onUpdateIframeIconChange as any}
						onRemoveCard={onRemoveIframe} />
				</>
			)}
		</>
	)
})

export default IframeCard;