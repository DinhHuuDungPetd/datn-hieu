"use client";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {View, Pencil, Files, Check, CircleOff, Unplug, PackageX} from "lucide-react";

export default function ActionMutiDropDown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
      <div className="relative">
        <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
          <span className="block mr-1 font-medium text-theme-sm">Chọn</span>

          <svg
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
        </button>

        <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="absolute right-0  flex min-w-[200px] flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-10"
        >
          <ul className="flex flex-col gap-1 pt-2 pb-2 border-b border-gray-200 dark:border-gray-800">
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <View size={18}  />
                Xem sản phẩm
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Pencil size={18} />
                Chỉnh sửa
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Files size={18} />
                Sao chép
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Check size={18} />
                Hoạt động
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <Unplug size={18} />
                Ngừng bán
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  href="/profile"
                  className="flex items-center gap-3 font-medium text-gray-700 rounded-lg group text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <PackageX size={18} />
                Hết hàng
              </DropdownItem>
            </li>
          </ul>
        </Dropdown>
      </div>
  );
}
