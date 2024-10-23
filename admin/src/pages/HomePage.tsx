import React, { useEffect, useRef, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { Page, Layouts } from '@strapi/strapi/admin';
import { getTranslation as getTrad } from '../utils/getTranslation';
import { DashboardCategory, DashboardIframe, DashboardItem, PluginSettingsResponse } from '../../../typings';
import { useNavigate } from "react-router-dom"; //In react-router-dom v6 useHistory() is replaced by useNavigate()
import DashboardCategoryDisplay from '../components/DashboardDisplay/DashboardCategoryDisplay';
import DashboardIframeDisplay from '../components/DashboardDisplay/DashboardIframeDisplay';

const HomePage = () => {
  const { formatMessage } = useIntl();

  const isMounted = useRef(true);
  const { get } = useFetchClient();

  const [title, setTitle] = useState<string | undefined>(undefined);
  const [subTitle, setSubTitle] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [categoryItems, setCategoryItems] = useState<Map<number, DashboardItem[]> | null>(null);
  const [iframes, setIframes] = useState<DashboardIframe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pluralCountMessage = formatMessage({ id: getTrad("plugin.settings.info.count.plural") });
  const singleCountMessage = formatMessage({ id: getTrad("plugin.settings.info.count.single") });

  const navigate = useNavigate();

  const handleClick = (item: DashboardItem) => {
    const url = (item.collectionType === 'collectionType') ?
      `/content-manager/collection-types/${item.entityId}` :
      `/content-manager/single-types/${item.entityId}`;
    navigate(url);
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get<PluginSettingsResponse>(`/custom-dashboard/settings/dashboard`);

      setTitle(data.title);
      setSubTitle(data.subTitle);

      if (data.categories.length > 0) {
        const sortedCategories = data.categories.sort(x => x.order);
        setCategories(sortedCategories);
      }

      if (data.iframes.length > 0) {
        const sortedIframes = data.iframes.sort(x => x.order);
        setIframes(sortedIframes);
      }

      let mappedItems = new Map<number, DashboardItem[]>();
      if (data.items.length > 0) {
        data.items.forEach(item => {
          if (mappedItems.has(item.category)) {
            mappedItems.get(item.category)?.push(item);
          }
          else {
            mappedItems.set(item.category, [item]);
          }
        });
      }
      setCategoryItems(mappedItems);

      setIsLoading(false);
    }
    fetchData();

    // unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (isLoading)
    return <Page.Loading />;

  return (
    <>
      <Layouts.BaseHeader
        id="title"
        title={title}
        subtitle={subTitle}
      >
      </Layouts.BaseHeader>
      <Layouts.Content>
        <>
          {categories.length > 0 && (
            categories.map((category) => (
              <DashboardCategoryDisplay key={category.id} category={category}
                categoryItems={categoryItems} handleClick={handleClick}
                pluralCountMessage={pluralCountMessage} singleCountMessage={singleCountMessage} />
            ))
          )}
          {iframes.length > 0 && (
            iframes.map((iframe) => (
              <DashboardIframeDisplay key={iframe.id} iframe={iframe} />
            ))
          )}
        </>
      </Layouts.Content>
    </>
  );
};

export { HomePage };
