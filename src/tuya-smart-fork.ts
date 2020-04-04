import { Red, StatusFill, Node } from "node-red";
import TuyAPI from "tuyapi";
import { TuyaSmartProperties } from "./interface";

module.exports = (RED: Red) => {
  function TuyaSmartConfigNode(properties: TuyaSmartProperties) {
    const node = this as Node;

    RED.nodes.createNode(node, properties);

    const request = JSON.parse(properties.request);

    const smartDevice = new TuyAPI({
      id: properties.deviceId,
      key: properties.deviceKey,
      ip: properties.deviceIp,
      version: properties.protocolVersion ?? "3.3",
    });

    const setNodeState = (fill: StatusFill, text: string) =>
      node.status({ fill, text, shape: "ring" });

    const disconnectFromDevice = () => smartDevice.disconnect();

    node.on("close", disconnectFromDevice);
    node.on("input", console.log);

    setNodeState("grey", "connecting...");

    smartDevice
      .find({ all: true, timeout: 10 })
      .then(() => {
        node.log(smartDevice);
        smartDevice.connect();
      })
      .catch((exception: any) => {
        setNodeState("red", "Error finding devices...");
        console.error("ex", exception);
      });

    smartDevice.on("connected", () => {
      node.log("[TuyaNode]: connected");
      setNodeState("green", "Connected");
      console.log("getting", request);
      smartDevice.get(request);
    });

    smartDevice.on("disconnected", () => {
      node.log("[TuyaNode]: disconnected");
      setNodeState("grey", "Disconnected");
    });

    smartDevice.on("error", (error) => {
      setNodeState("red", "Error!");
      node.log("[TuyaNode]: error");
      node.log(error);
      console.log("Error!", error);
    });

    smartDevice.on("data", (data) => {
      console.log("Data from device:", data);

      node.log(data);
    });
  }

  RED.nodes.registerType<TuyaSmartProperties>(
    "tuya-smart-fork",
    TuyaSmartConfigNode
  );
};
