import "./globals.css";
import Header from "./header";

export const metadata = {
  title: "Chandresh Vaibhav Utsav Mandal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        <Header />
        {children}
      </body>
    </html>
  );
}
