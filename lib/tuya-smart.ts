import { Red } from "node-red";
import TuyAPI from "tuyapi";
import { TuyaSmartNode, TuyaSmartProperties } from "./tuya-smart-properties";

export = (RED: Red) => {
  function TuyaSmartConfigNode(
    this: TuyaSmartNode,
    properties: TuyaSmartProperties
  ) {
    const node = this;

    RED.nodes.createNode(node, properties);

    const request = JSON.parse(properties.request);

    const smartDevice = new TuyAPI({
      id: properties.deviceId,
      key: properties.deviceKey,
      ip: properties.deviceIp,
      version: properties.protocolVersion ?? "3.3"
    });

    const indicateConnectionOk = () =>
      node.status({ fill: "green", shape: "ring", text: "connected" });

    const indicateConnectionError = () =>
      node.status({ fill: "red", shape: "ring", text: "disconnected" });

    // const indicateFailedToSetState = () =>
    //   node.status({ fill: "red", shape: "ring", text: "error changing state" });

    const disconnectFromDevice = () => smartDevice.disconnect();

    node.on("close", disconnectFromDevice);
    node.on("input", console.log);
    node.status({ fill: "yellow", shape: "ring", text: "connecting" });

    smartDevice
      .find()
      .then(() => {
        smartDevice.connect();
      })
      .catch((exception: any) => {
        indicateConnectionError();
        console.log("ex", exception);
      });

    smartDevice.on("connected", () => {
      indicateConnectionOk();
      smartDevice.get(request);
    });

    smartDevice.on("disconnected", () => {
      console.log("Disconnected from device.");
    });

    smartDevice.on("error", error => {
      console.log("Error!", error);
    });

    smartDevice.on("data", data => {
      console.log("Data from device:", data);
      console.log(`Boolean status of default property: ${data.dps["1"]}.`);

      node.log(data);
    });
  }

  RED.nodes.registerType("tuya-smart-fork", TuyaSmartConfigNode, {
    credentials: {
      deviceKey: { type: "text" }
    }
  });
};
