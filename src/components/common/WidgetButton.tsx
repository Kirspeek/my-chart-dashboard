"use client";

export default function WidgetButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
      {...props}
    />
  );
}
