import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button, Text } from "@saleor/macaw-ui";

const ClientWidget: NextPage = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    if (!appBridgeState?.ready) return;
    const encoded = appBridgeState.path.split("products/")[1];
    if (!encoded) return;
    setProductId(decodeURIComponent(encoded));
  }, [appBridgeState?.ready, appBridgeState?.path]);

  if (!appBridgeState?.ready || !productId) {
    return <Text>Loading…</Text>;
  }

  const openDetails = () => {
    appBridge?.dispatch({
      type: "redirect",
      payload: {
        actionId: "open-client-widget-details",
        to: `/extensions/app/${appBridgeState.id}/info?productId=${encodeURIComponent(productId)}`,
      },
    });
  };

  return (
    <div>
      <Text>Index status available</Text>
      <Button variant="secondary" onClick={openDetails}>
        View indexed data
      </Button>
    </div>
  );
};

export default ClientWidget;
