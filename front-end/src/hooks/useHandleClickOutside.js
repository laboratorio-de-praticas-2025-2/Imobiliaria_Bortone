// hooks/useHandleClickOutside.js
import { useEffect } from "react";

export default function useHandleClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      // Verifica se o clique foi em um elemento do Ant Design
      const antSelectDropdown = document.querySelector(".ant-select-dropdown");
      const antPickerDropdown = document.querySelector(".ant-picker-dropdown");
      const antDropdown = document.querySelector(".ant-dropdown");
      
      if (
        (antSelectDropdown && antSelectDropdown.contains(event.target)) ||
        (antPickerDropdown && antPickerDropdown.contains(event.target)) ||
        (antDropdown && antDropdown.contains(event.target))
      ) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}