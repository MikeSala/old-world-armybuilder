"use client";

import { useEffect } from "react";

export default function BuyMeCoffeeWidget() {
  useEffect(() => {
    const div = document.getElementById("supportByBMC");
    if (!div || div.childElementCount > 0) return;

    const script = document.createElement("script");
    script.setAttribute("src", "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js");
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "mikesala");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute(
      "data-message",
      "Hi, my Chaos-mutated body runs on coffee. Help me expand the project further!"
    );
    script.setAttribute("data-color", "#5F7FFF");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "10");
    script.setAttribute("data-y_margin", "10");

    script.onload = function () {
      const evt = document.createEvent("Event");
      evt.initEvent("DOMContentLoaded", false, false);
      window.dispatchEvent(evt);
    };

    div.appendChild(script);
  }, []);

  return <div id="supportByBMC" />;
}
