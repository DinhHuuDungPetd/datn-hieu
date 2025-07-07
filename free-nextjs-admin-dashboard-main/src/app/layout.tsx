import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        <ToastContainer
            position="top-right"
            autoClose={3000} // Đóng sau 3 giây
            hideProgressBar={false} // Hiển thị thanh tiến trình
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
        />
      </body>
    </html>
  );
}
