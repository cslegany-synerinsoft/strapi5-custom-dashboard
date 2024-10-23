import React from 'react';
import {
  Box,
  Flex,
  Typography,
  Grid,
} from '@strapi/design-system';
import { DashboardIframe } from '../../../../typings';
import iconConverter from '../../utils/iconConverter';
import Iframe from 'react-iframe'
import IframeResizer from '../IframeResizer';

interface DashboardIframeDisplayProps {
  iframe: DashboardIframe;
}

const DashboardIframeDisplay = (props: DashboardIframeDisplayProps) => {
  const { iframe } = props;

  const renderIframe = (iframe: DashboardIframe) => {
    if (iframe.resize) {
      return (
        <Flex justifyContent="center">
          <IframeResizer
            style={{
              width: `${iframe.width ?? "100%"}`,
              minWidth: `${iframe.width ?? "100%"}`,
              height: `${iframe.height ?? "500px"}`,
              minHeight: `${iframe.height ?? "500px"}`,
              borderRadius: '0.5rem',
              padding: '0 4px'
            }}
            src={iframe.url}
            heightCalculationMethod="max"
          />
        </Flex>
      );
    } else {
      return (
        <Flex justifyContent="center">
          <Iframe url={iframe.url}
            width={iframe.width ?? "100%"}
            height={iframe.height ?? "500px"}
            id={iframe.id.toString()}
            className=""
            display="block"
            frameBorder={0}
            position="relative" />
        </Flex>
      );
    }
  }

  return (
    <Box key={iframe.id} paddingBottom={4}>
      <Box background="neutral0" hasRadius={true} shadow="filterShadow">
        <Flex justifyContent="center" padding={4}>
          <Box paddingRight={2} paddingTop={1}>
            {iframe.icon && iconConverter(iframe.icon)}
          </Box>
          <Typography variant="beta">{iframe.label}</Typography>
        </Flex>
        {iframe.hint && (
          <Box paddingBottom={2}>
            <Flex justifyContent="center">
              <Typography variant="pi">
                {iframe.hint}
              </Typography>
            </Flex>
          </Box>
        )}
        <Box padding={2}>
          {renderIframe(iframe)}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardIframeDisplay;